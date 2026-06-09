async function testGuardian() {
  const q = "artificial intelligence";
  // The Guardian endpoint with test key and show-fields=trailText,thumbnail,body
  const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(q)}&tag=technology/technology&show-fields=trailText,thumbnail,body&api-key=test`;
  
  try {
    console.log("Fetching AI news from The Guardian API...");
    const res = await fetch(url);
    const data = await res.json();
    console.log("API Status:", data.response?.status);
    console.log("Total Results:", data.response?.total);
    
    if (data.response?.results && data.response.results.length > 0) {
      console.log("Sample article structure (first result):");
      console.dir(data.response.results[0], { depth: null });
    } else {
      console.log("No articles found. Full response:", data);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testGuardian();
