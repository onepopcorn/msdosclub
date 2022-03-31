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
