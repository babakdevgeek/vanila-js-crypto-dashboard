export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Try to serve from static assets first
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.ok) {
      return assetResponse;
    }

    // SPA fallback: serve index.html for all non-asset routes
    const indexRequest = new Request(new URL("/index.html", request.url), request);
    return env.ASSETS.fetch(indexRequest);
  },
};