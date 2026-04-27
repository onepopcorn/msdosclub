import { http, HttpResponse } from 'msw';

// Set handlers for common requests that needs to be intercepted here but keep specific
// handlers close to where they are gonna be used
const handlers = [
  http.get('https://msdos.club/wp-json/wp/v2/posts', () => {
    return HttpResponse.json([]);
  }),
  http.get('https://msdos.club/wp-json/wp/v2/comments', () => {
    return HttpResponse.json([]);
  }),
  http.get('/shoelace/assets/icons/:icon', async (_, res, ctx) => {
    return new HttpResponse('<svg xmlns="http://www.w3.org/2000/svg"></svg>', {
      headers: {
        'Content-Type': 'image/svg+xml',
      }
    });
  }),

  http.get('/assets/icons/:icon', async (_, res, ctx) => {
    return new HttpResponse('<svg xmlns="http://www.w3.org/2000/svg"></svg>', {
      headers: {
        'Content-Type': 'image/svg+xml',
      }
    });
  }),
];

export { handlers };
