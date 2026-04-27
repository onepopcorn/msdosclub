import { render, screen, waitForElementToBeRemoved, queryClient } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { server, http, HttpResponse } from 'test-utils/mocks/server';
import Posts from './Posts';

const endpoint = 'https://msdos.club/wp-json/wp/v2/posts';
queryClient.setDefaultOptions({
  queries: {
    retry: false,
    cacheTime: false,
  },
});

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

test('Posts should show retrieved posts from API', async () => {
  // Mock api response
  server.use(
    http.get(endpoint, async ({request}) => {
      const url = new URL(request.url);
      const page = url.searchParams.get('page');
      const posts = require(`../../../test-utils/__fixtures__/posts_page_${page}.json`);
      return HttpResponse.json(posts, {
        headers: {
          'X-WP-Total': 10,
          'X-WP-TotalPages': 2,
        }
      });
    }),
  );

  // Mock infinite scroll feats
  const intersection = vi.fn();
  vi.spyOn(global.IntersectionObserver.prototype, 'constructor').mockImplementation(intersection);

  render(<Posts categories={2} />);
  await waitForElementToBeRemoved(screen.getByTestId('spinner'));

  // First page content
  screen.getByText(/post 1 title/i);

  // Force load content of second page
  intersection.mockReturnValue({ entries: [{ isIntersecting: true }] });
  screen.getByText(/Floppy19 – DOS versus NINTENDO/i);
});

test.skip('Posts should open post detail when click on a post', async () => {
  // Mock api response
  server.use(
    http.get(endpoint, async () => {
      const posts = require(`test-utils/__fixtures__/posts_page_1.json`);

      return HttpResponse.json(posts,{headers: {
        'X-WP-Total': 5,
        'X-WP-TotalPages': 1,
      }})
    }),
    http.get('https://msdos.club/wp-json/wp/v2/comments', () => {
      return HttpResponse.json([])
    }),
  );

  render(<Posts categories={2} />);
  await waitForElementToBeRemoved(screen.getByTestId('spinner'));

  userEvent.click(screen.getByText(/DOS versus NINTENDO/i, { exact: false }));
  await screen.findByText(/eneko de @podcastnintendo por su participación./i, { exact: false });
});
