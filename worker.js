export default {
  async fetch(request, env) {
    // Try to serve the requested asset
    const response = await env.ASSETS.fetch(request);
    if (response.ok) return response;

    // Not found → SPA fallback: serve index.html
    const indexResponse = await env.ASSETS.fetch("/index.html");
    if (indexResponse.ok) return indexResponse;

    return new Response("Not Found", { status: 404 });
  },
};