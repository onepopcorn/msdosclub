// import WPAPI from 'wpapi'
import { processPosts, parseCategoryArrays } from 'utils/wp-utils.ts'

const endpoint = 'https://msdos.club/wp-json/wp/v2'

const makeRequest = async (route) => {
    const req = await fetch(`${endpoint}/${route}`)
    const res = await req.json()

    Object.defineProperty(res, '_paging', {
        value: {
            total: req.headers.get('X-WP-Total'),
            totalPages: req.headers.get('X-WP-TotalPages'),
        },
    })

    return res
}

export const getPosts = async ({ queryKey, pageParam = 1 }) => {
    const [, { categories, perPage = 6 }] = queryKey
    const { include, exclude } = parseCategoryArrays(categories);

    // Manage URL parameters
    const params = new URLSearchParams()
    params.append('_embed', true)
    params.append('categories', include)
    params.append('page', pageParam)
    params.append('per_page', perPage)
    exclude && params.append('categories_exclude', exclude)

    const data = await makeRequest(`posts?${params.toString()}`)
    return {
        posts: processPosts(data),
        nextPage: data._paging.totalPages > pageParam ? pageParam + 1 : null,
    }
}

export const getComments = async ({ queryKey }) => {
    const [, id] = queryKey
    const comments = await makeRequest(`comments?order=asc&per_page=100&post=${id}`)
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
