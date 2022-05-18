import { server, rest } from 'test-utils/mocks/server'
import { getComments, getPosts } from 'api/wpapi'

test('wpapi should return a list of posts for a given page and next page number if any', async () => {
    server.use(
        rest.get('https://msdos.club/wp-json/wp/v2/posts', async (req, res, ctx) => {
            const page = req.url.searchParams.get('page')
            const posts = await require(`test-utils/__fixtures__/posts_page_${page}.json`)
            return res(ctx.set('X-WP-Total', 12), ctx.set('X-WP-TotalPages', 2), ctx.json(posts))
        }),
    )

    const { posts, nextPage } = await getPosts({ queryKey: [null, { categories: 2 }], pageParam: 1 })
    expect(posts.length).toBe(6)
    expect(nextPage).toBe(2)
})

test('getComments should return a list of parent comments and a list of child comments', async () => {
    server.use(
        rest.get('https://msdos.club/wp-json/wp/v2/comments', async (_, res, ctx) => {
            const comments = await require('test-utils/__fixtures__/comments_nested.json')
            return res(ctx.json(comments))
        }),
    )

    const { parentComments, childComments } = await getComments({ queryKey: [null, 1] })
    expect(parentComments.length).toBe(3)
    expect(Object.entries(childComments).length).toBe(3)
})
