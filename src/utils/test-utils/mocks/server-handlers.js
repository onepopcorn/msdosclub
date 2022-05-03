import { rest } from 'msw'
import * as fs from 'fs/promises'

const handlers = [
    // External API
    rest.get('https://msdos.club/wp-json/wp/v2/posts', async (req, res, ctx) => {
        const { page } = req.params
        const posts = await fs.readFile(`./__fixtures__/posts_page_${page}.json`)
        return res(ctx.set('X-WP-Total', 12), ctx.set('X-WP-TotalPages', 2), ctx.json(posts))
    }),

    rest.get('http://msdos.club/wp-json/wp/v2/comments', async (req, res, ctx) => {
        const { post } = req.params
        const comments = await fs.readFile(`./__fixtures__/comments_${post}.json`)
        return res(ctx.json(comments))
    }),

    // Assets
    rest.get('/shoelace/assets/icons/:icon', async (_, res, ctx) => {
        return res(ctx.set('Content-Type', 'image/svg+xml'), ctx.body('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
    }),

    rest.get('/assets/icons/:icon', async (_, res, ctx) => {
        return res(ctx.set('Content-Type', 'image/svg+xml'), ctx.body('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
    }),

    // handle svg used as data uri
    rest.get('data:///image/svg+xml', async (_, res, ctx) => {
        return res(ctx.set('Content-Type', 'image/svg+xml'), ctx.body('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
    }),
]

export { handlers }