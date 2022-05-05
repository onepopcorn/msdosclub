import { rest } from 'msw'

// Set handlers for common requests that needs to be intercepted here but keep specific
// handlers close to where they are gonna be used
const handlers = [
    rest.get('/shoelace/assets/icons/:icon', async (_, res, ctx) => {
        return res(ctx.set('Content-Type', 'image/svg+xml'), ctx.body('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
    }),

    rest.get('/assets/icons/:icon', async (_, res, ctx) => {
        return res(ctx.set('Content-Type', 'image/svg+xml'), ctx.body('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
    }),
]

export { handlers }
