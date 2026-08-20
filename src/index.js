export default {
  async fetch(request, env) {
    // Try to serve from static assets first
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.ok) {
      return assetResponse;
    }

    // SPA fallback: serve index.html for all non-asset routes
    const url = new URL(request.url);
    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url.toString(), request));
  },
};
