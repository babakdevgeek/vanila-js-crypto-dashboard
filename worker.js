export default {
  async fetch(request, env) {
    // Look up the requested file in static assets
    const response = await env.ASSETS.fetch(request);
    if (response.ok) {
      return response;
    }

    // File not found → serve index.html for the client-side router
    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url)));
  },
};
