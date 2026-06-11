import https from "https";
import http from "http";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 * A custom fetch implementation that supports HttpsProxyAgent when process.env.PROXY_URL is set.
 * Falls back to direct node http/https requests.
 */
export function customFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  redirectCount = 0
): Promise<Response> {
  if (redirectCount > 5) {
    return Promise.reject(new Error("Too many redirects"));
  }
  const proxyUrl = process.env.PROXY_URL;
  const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

  const urlString = typeof input === "string" 
    ? input 
    : (input instanceof URL 
      ? input.toString() 
      : (input as any).url || "");

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlString);
    const reqOptions: https.RequestOptions = {
      method: init?.method || "GET",
      headers: (init?.headers as any) || {},
      agent: agent,
    };

    const isSecure = parsedUrl.protocol === "https:";
    const requestFn = isSecure ? https.request : http.request;

    const req = requestFn(urlString, reqOptions, (res) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, urlString).toString();
        resolve(customFetch(redirectUrl, init, redirectCount + 1));
        return;
      }

      const chunks: any[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const bodyBuffer = Buffer.concat(chunks);
        const textContent = bodyBuffer.toString("utf8");

        const responseObj = {
          ok: (res.statusCode || 0) >= 200 && (res.statusCode || 0) < 300,
          status: res.statusCode || 200,
          statusText: res.statusMessage || "",
          headers: new Headers(res.headers as any),
          text: async () => textContent,
          json: async () => JSON.parse(textContent),
          clone: () => responseObj,
          body: null,
          bodyUsed: true,
          arrayBuffer: async () => bodyBuffer.buffer.slice(bodyBuffer.byteOffset, bodyBuffer.byteOffset + bodyBuffer.byteLength),
          blob: async () => new Blob([bodyBuffer]),
          formData: async () => new FormData(),
          type: "basic" as ResponseType,
          url: urlString,
          redirected: redirectCount > 0,
        };

        resolve(responseObj as unknown as Response);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (init?.body) {
      req.write(init.body as any);
    }
    req.end();
  });
}
