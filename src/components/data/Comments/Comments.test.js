import { server, rest } from 'utils/test-utils/mocks/server'
import {
    renderWithQueryClient as render,
    queryClient,
    screen,
    waitForElementToBeRemoved,
    within,
} from 'utils/test-utils'
import userEvent from '@testing-library/user-event'
import Comments from './Comments'

// Clear react-query cache after each test
const queryCache = queryClient.getQueryCache()
afterEach(() => queryCache.clear())

const endpoint = 'https://msdos.club/wp-json/wp/v2/comments'

test('Comments should render comments for given post ID', async () => {
    // Mock api response
    server.use(
        rest.get(endpoint, async (_, res, ctx) => {
            const comments = await require('utils/test-utils/__fixtures__/comments_single.json')
            return res(ctx.json(comments))
        }),
    )

    render(<Comments postId={1} />)

    // show loader while comments are not loaded yet
    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'))

    // show comments & comment author after loading
    expect(screen.getAllByRole('listitem').length).toBe(1)
    screen.getByText(/gran episodio/i)
    screen.getByText(/museo de la informática/i)
})

test('Comments should show nested comments in order when needed', async () => {
    // Mock api response
    server.use(
        rest.get(endpoint, async (_, res, ctx) => {
            const comments = await require('utils/test-utils/__fixtures__/comments_nested.json')
            return res(ctx.json(comments))
        }),
    )

    render(<Comments postId={1} />)

    // show loader while comments are not loaded yet
    await waitForElementToBeRemoved(() => screen.getByTestId('spinner'))

    // show comments & comment author after loading
    const commentsList = screen.getAllByRole('listitem')
    const firstComment = commentsList[0]
    const firstAnswer = commentsList[1]

    within(firstComment).getByText(/merino/i)
    within(firstAnswer).getByText(/vampirro/i)
})
