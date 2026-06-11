import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { getYoutubeVideoId, getYoutubePlaylistId } from "@/lib/youtube";
import https from "https";
import { customFetch } from "@/lib/proxy-fetch";

function translateText(text: string, targetLang = 'en'): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const translated = parsed[0].map((item: any) => item[0]).join('');
            resolve(translated);
          } else {
            reject(new Error("Invalid translate response"));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function translateTranscript(items: any[]): Promise<any[]> {
  const lines = items.map(item => item.text);
  
  // Group lines into chunks of max 1500 characters
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;
  
  for (const line of lines) {
    if (currentLength + line.length + 1 > 1500) {
      chunks.push(currentChunk);
      currentChunk = [line];
      currentLength = line.length;
    } else {
      currentChunk.push(line);
      currentLength += line.length + 1;
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  // Run all translation requests in parallel
  const promises = chunks.map(chunk => {
    const joined = chunk.join('\n');
    return translateText(joined).then(translatedJoined => {
      const split = translatedJoined.split('\n');
      return chunk.map((orig, i) => split[i] || orig);
    }).catch(e => {
      console.error("Chunk translation failed:", e.message);
      return chunk; // fallback to original lines on error
    });
  });
  
  const results = await Promise.all(promises);
  const translatedLines = ([] as string[]).concat(...results);
  
  return items.map((item, idx) => ({
    ...item,
    text: translatedLines[idx] || item.text
  }));
}

function parsePlaylistHtml(html: string): { id: string; title: string }[] {
  const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/) || html.match(/ytInitialData\s*=\s*({.+?});/);
  if (match) {
    try {
      const data = JSON.parse(match[1]);
      
      const videos: { id: string; title: string }[] = [];
      const seenIds = new Set<string>();

      function traverse(obj: any) {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          obj.forEach(item => traverse(item));
        } else {
          if (obj.lockupViewModel) {
            const videoId = obj.lockupViewModel.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId;
            const title = obj.lockupViewModel.metadata?.lockupMetadataViewModel?.title?.content;
            if (videoId && title && !seenIds.has(videoId)) {
              seenIds.add(videoId);
              videos.push({ id: videoId, title });
            }
          }
          if (obj.playlistVideoRenderer) {
            const videoId = obj.playlistVideoRenderer.videoId;
            const title = obj.playlistVideoRenderer.title?.runs?.[0]?.text || obj.playlistVideoRenderer.title?.simpleText;
            if (videoId && title && !seenIds.has(videoId)) {
              seenIds.add(videoId);
              videos.push({ id: videoId, title });
            }
          }
          for (const key in obj) {
            traverse(obj[key]);
          }
        }
      }

      traverse(data);
      if (videos.length > 0) {
        return videos;
      }
    } catch (e) {
      console.error("Failed to parse ytInitialData JSON:", e);
    }
  }

  const videos: { id: string; title: string }[] = [];
  const seenIds = new Set<string>();
  const watchRegex = /watch\?v=([a-zA-Z0-9_-]{11})/g;
  let m;
  while ((m = watchRegex.exec(html)) !== null) {
    const videoId = m[1];
    if (!seenIds.has(videoId)) {
      seenIds.add(videoId);
      videos.push({ id: videoId, title: `Video ${videos.length + 1}` });
    }
  }
  return videos;
}

function getVideosFromPlaylist(playlistId: string): Promise<{ id: string; title: string }[]> {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const videos = parsePlaylistHtml(data);
        resolve(videos);
      });
    }).on('error', reject);
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const checkOnly = searchParams.get("check") === "true";
  const playlistOnly = searchParams.get("playlist") === "true";

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  const videoId = getYoutubeVideoId(url);
  const playlistId = getYoutubePlaylistId(url);

  if (!videoId && !playlistId) {
    return NextResponse.json(
      checkOnly ? { extractable: false } : { error: "The provided URL is not a valid YouTube video or playlist URL." },
      { status: checkOnly ? 200 : 400 }
    );
  }

  if (playlistOnly && playlistId) {
    try {
      const videos = await getVideosFromPlaylist(playlistId);
      return NextResponse.json({ videos });
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || "Failed to fetch playlist videos" },
        { status: 500 }
      );
    }
  }

  let targetVideoId = videoId;
  if (!targetVideoId && playlistId) {
    try {
      const playlistVideos = await getVideosFromPlaylist(playlistId);
      if (playlistVideos.length > 0) {
        targetVideoId = playlistVideos[0].id;
      }
    } catch (e) {
      console.warn("Failed to get playlist videos:", e);
    }
  }

  if (!targetVideoId) {
    return NextResponse.json(
      checkOnly ? { extractable: false } : { error: "Could not find a video to extract transcripts from." },
      { status: checkOnly ? 200 : 400 }
    );
  }

  if (checkOnly) {
    return NextResponse.json({ extractable: true });
  }

  try {
    let transcript: any[] = [];
    let fetchedViaSupadata = false;
    let fetchedLocally = false;

    const keysString = process.env.SUPADATA_API_KEYS || process.env.SUPADATA_API_KEY || "";
    const apiKeys = keysString.split(",").map(k => k.trim()).filter(Boolean);
    const isProduction = !!(process.env.VERCEL || process.env.NODE_ENV === "production");

    if (!isProduction) {
      // Local development: prioritize the free normal scraper first to conserve credits
      try {
        console.log(`[Local Scraper] Running free local scraper for ${targetVideoId}...`);
        const config = process.env.PROXY_URL ? { fetch: customFetch } : undefined;
        transcript = await YoutubeTranscript.fetchTranscript(targetVideoId, config);
        fetchedLocally = true;
        console.log(`[Local Scraper] Successfully fetched transcript for ${targetVideoId}.`);
      } catch (e: any) {
        console.warn("[Local Scraper] Free local scraper failed, trying Supadata fallback:", e.message);
      }
    }

    // Try Supadata if:
    // 1. In production (where Supadata is prioritized to bypass Vercel IP blocks)
    // 2. Or if local scraper failed and we haven't successfully fetched it yet
    if (!fetchedLocally && apiKeys.length > 0) {
      for (const apiKey of apiKeys) {
        try {
          console.log(`[Supadata] Fetching transcript for ${targetVideoId} using key ending in ...${apiKey.slice(-6)}`);
          const targetUrl = `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${targetVideoId}`)}`;
          const res = await fetch(targetUrl, {
            headers: {
              "x-api-key": apiKey,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.content)) {
              transcript = data.content.map((item: any) => ({
                text: item.text,
                offset: item.offset || 0,
                duration: item.duration || 0,
              }));
              fetchedViaSupadata = true;
              console.log(`[Supadata] Successfully fetched transcript for ${targetVideoId}.`);
              break;
            }
          } else {
            const errorData = await res.json().catch(() => ({}));
            console.warn(`[Supadata] Request failed with status ${res.status} for key ending in ...${apiKey.slice(-6)}:`, errorData.error || res.status);
          }
        } catch (e: any) {
          console.warn(`[Supadata] Error using key ending in ...${apiKey.slice(-6)}:`, e.message);
        }
      }
    }

    // Fallback: If in production and Supadata failed, try the local scraper via proxy
    if (!fetchedViaSupadata && !fetchedLocally) {
      console.log(`[Production Scraper] Running scraper fallback for ${targetVideoId}...`);
      const config = process.env.PROXY_URL ? { fetch: customFetch } : undefined;
      transcript = await YoutubeTranscript.fetchTranscript(targetVideoId, config);
    }

    if (checkOnly) {
      return NextResponse.json({ extractable: Array.isArray(transcript) && transcript.length > 0 });
    }

    // Check if the transcript contains non-English characters and needs translation
    const needsTranslation = transcript.some(item => {
      const cleaned = item.text.replace(/[\x00-\x7F\u2010-\u201F\u2022\u2026\u2122\u00A9\u00AE]/g, "");
      return cleaned.length > 0;
    });

    if (needsTranslation) {
      console.log(`[Translation] Translating transcript for video ${targetVideoId} to English...`);
      transcript = await translateTranscript(transcript);
    }

    // If we had an AI API Key, we would pass the text to an LLM here to generate
    // intelligent semantic topics. Without one, we will use a time-chunking heuristic
    // to group the transcript into "Topics" (every 5 minutes) and "Subtopics" (sentences).
    
    const CHUNK_MS = 5 * 60 * 1000; // 5 minutes
    
    const topics: { title: string; timestamp: number; subtopics: string[] }[] = [];
    
    let currentTopicIndex = -1;
    let currentChunkBoundary = -1;

    for (const item of transcript) {
      if (item.offset >= currentChunkBoundary) {
        currentTopicIndex++;
        currentChunkBoundary += CHUNK_MS;
        
        // Format timestamp as M:SS
        const minutes = Math.floor(item.offset / 60000);
        const seconds = Math.floor((item.offset % 60000) / 1000).toString().padStart(2, '0');
        
        topics.push({
          title: `Segment ${currentTopicIndex + 1} (${minutes}:${seconds})`,
          timestamp: item.offset,
          subtopics: [],
        });
      }
      
      topics[currentTopicIndex].subtopics.push(item.text);
    }

    return NextResponse.json({ topics });
  } catch (error: any) {
    console.error("Error fetching transcript:", error);
    
    // Detect if we are likely blocked by YouTube in production (Vercel)
    const errorStr = (error.message || "").toLowerCase();
    const isRateLimited = errorStr.includes("too many requests") || errorStr.includes("captcha") || errorStr.includes("429");
    const isUnavailable = errorStr.includes("disabled") || errorStr.includes("no transcripts") || errorStr.includes("not available");
    
    // On serverless / Vercel, requests failing with generic errors or blocks are highly likely IP blocks.
    const isVercel = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.NETLIFY);
    const probablyBlocked = isVercel && (isRateLimited || !isUnavailable);

    if (checkOnly) {
      return NextResponse.json({
        extractable: false,
        reason: probablyBlocked ? "ip_blocked" : "not_available",
        error: error.message || "Unknown error"
      });
    }
    return NextResponse.json(
      {
        error: error.message || "Failed to extract transcript",
        reason: probablyBlocked ? "ip_blocked" : "not_available"
      },
      { status: 500 }
    );
  }
}
