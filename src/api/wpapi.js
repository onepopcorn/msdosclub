import WPAPI from 'wpapi'
import { processPosts } from 'utils/wp-utils.ts'

const endpoint = 'https://msdos.club/wp-json'
const wp = new WPAPI({ endpoint })

export const getPosts = async ({ queryKey, pageParam = 1 }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, { categories = 2, perPage = 6 }] = queryKey
    const data = await wp.posts().categories(categories.toString()).perPage(perPage).page(pageParam).embed().get()
    return {
        posts: processPosts(data),
        nextPage: data._paging.totalPages > pageParam ? pageParam + 1 : null,
    }
}

export const getComments = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, id] = queryKey
    const comments = await wp.comments().post(id).perPage(100).order('asc')
    const data = comments.reduce(
        (acc, curr) => {
            if (curr.parent === 0) acc.parentComments.push(curr)
            if (curr.parent > 0) {
                const childList = acc.childComments[curr.parent]
                acc.childComments[curr.parent] = Array.isArray(childList) ? [...childList, curr] : [curr]
            }
            return acc
        },
        { parentComments: [], childComments: {} },
    )

    return data
}
