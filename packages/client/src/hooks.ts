/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    console.log(event.url.pathname)
    const response = await resolve(event, {
      ssr: !event.url.pathname.startsWith('/connection') && !(event.url.pathname === '/'),
    });
   
    return response;
}