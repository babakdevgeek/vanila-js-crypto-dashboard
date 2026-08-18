export async function onRequest(context) {
  // Try to serve the static asset
  const response = await context.env.ASSETS.fetch(context.request);

  // If the asset exists, serve it
  if (response.status === 200) {
    return response;
  }

  // Otherwise, serve index.html for SPA client-side routing
  const url = new URL(context.request.url);
  url.pathname = "/index.html";
  return context.env.ASSETS.fetch(url);
}
