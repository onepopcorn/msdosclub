import { render, screen, waitForElementToBeRemoved, queryClient } from 'utils/test-utils'
import userEvent from '@testing-library/user-event'
import { server, rest } from 'utils/test-utils/mocks/server'
import Posts from './Posts'

const endpoint = 'https://msdos.club/wp-json/wp/v2/posts'
queryClient.setDefaultOptions({
    queries: {
        retry: false,
        cacheTime: false,
    },
})

beforeEach(() => {
    global.IntersectionObserver = class {
        observe() {}
        disconnect() {}
    }
})

test('Posts should show retrieved posts from API', async () => {
    // Mock api response
    server.use(
        rest.get(endpoint, async (req, res, ctx) => {
            const page = req.url.searchParams.get('page')
            const posts = await require(`utils/test-utils/__fixtures__/posts_page_${page}.json`)
            return res(ctx.set('X-WP-Total', 10), ctx.set('X-WP-TotalPages', 2), ctx.json(posts))
        }),
    )

    // Mock infinite scroll feats
    const intersection = jest.fn()
    jest.spyOn(global.IntersectionObserver.prototype, 'constructor').mockImplementation(intersection)

    render(<Posts categories={2} />)
    await waitForElementToBeRemoved(screen.getByTestId('spinner'))

    // First page content
    screen.getByText(/post 1 title/i)

    // Force load content of second page
    intersection.mockReturnValue({ entries: [{ isIntersecting: true }] })
    screen.getByText(/Floppy19 – DOS versus NINTENDO/i)
})

test('Posts should open post detail when click on a post', async () => {
    // Mock api response
    server.use(
        rest.get(endpoint, async (_, res, ctx) => {
            const posts = await require(`utils/test-utils/__fixtures__/posts_page_1.json`)
            return res(ctx.set('X-WP-Total', 5), ctx.set('X-WP-TotalPages', 1), ctx.json(posts))
        }),
        rest.get('https://msdos.club/wp-json/wp/v2/comments', (_, res, ctx) => {
            return res(ctx.json([]))
        }),
    )

    render(<Posts categories={2} />)
    await waitForElementToBeRemoved(screen.getByTestId('spinner'))

    userEvent.click(screen.getByText(/DOS versus NINTENDO/i, { exact: false }))
    await screen.findByText(/eneko de @podcastnintendo por su participación./i, { exact: false })
})
