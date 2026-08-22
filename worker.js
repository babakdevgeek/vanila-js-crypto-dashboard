export default {
  async fetch(request, env) {
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.ok) return response;
    } catch (e) {
      // Asset fetch failed, fall through to SPA fallback
    }

    // SPA fallback: serve index.html
    try {
      const url = new URL(request.url);
      url.pathname = "/index.html";
      const response = await env.ASSETS.fetch(url.toString());
      if (response.ok) return response;
    } catch (e) {
      // index.html fetch also failed
    }

    return new Response("Not Found", { status: 404 });
  },
};
