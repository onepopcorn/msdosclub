import { decode } from 'html-entities'

/**
 * Poor man's cache
 *
 */
const cache = new Map()

/**
 * Utility function remove unwanted nodes from content
 *
 */
function isValidNode(node: HTMLElement, title: string): boolean {
    // Remove node that contains the audio file
    return (
        !node.querySelector('.powerpress_player') &&
        // Remove node that contains the post title
        node.id !== 'lineaTiempo' &&
        // Remove node with audio file link
        !node.textContent?.includes('Descargar el episodio') &&
        // Remove other possible nodes containing the post title
        !(['h2', 'h3'].includes(node.nodeName.toLocaleLowerCase()) && node.textContent?.includes(title))
    )
}
/**
 * Utility function to clean post content and extract data from it
 *
 */
type AudioSource = {
    name: string
    url: string
}

type PodcastData = {
    content: string
    audio: string
    sources: AudioSource[]
    title: string
    slug: string
    firstImage?: { source_url: string; media_details: { width: number; height: number } }
}

const getSourcesList = (doc: Document): [NodeListOf<HTMLAnchorElement>, HTMLElement] | Array<undefined> => {
    const paths = document.evaluate('//p[contains(., "Escuchar en")]', doc, null, XPathResult.ANY_TYPE, null)
    const node = paths.iterateNext() as HTMLElement

    // If XPath didn't work just bail out
    if (!node) return

    // XPath found, return its a tagas
    const links = node.querySelectorAll('a')
    if (links) return [links, node]
}

export const getPodcastdata = (html: string, title: string, slug: string, featured_media: boolean): PodcastData => {
    const parser: DOMParser = new DOMParser()
    const doc: Document = parser.parseFromString(html, 'text/html')
    const audio: HTMLAudioElement | null = doc.querySelector('audio source')
    const contents: NodeListOf<HTMLElement> = doc.querySelectorAll('body > *')
    const [sourcesList, sourcesNode] = getSourcesList(doc) || [[], null]

    const text: string[] = []
    let firstImageFound: boolean = false
    let firstImage: PodcastData['firstImage']

    contents.forEach((node: HTMLElement) => {
        // Discard unwanted nodes
        if (!isValidNode(node, title)) return

        // Remove sources list if still there (because classname is not set)
        if (sourcesNode && sourcesNode.parentElement === node) node.removeChild(sourcesNode)

        // Remove first image because it's the same as thumbnail
        if (node.querySelector('img') && !firstImageFound) {
            firstImageFound = true
            if (featured_media) {
                const img = node.querySelector('img')
                firstImage = { source_url: img.src, media_details: { width: img.width, height: img.height } }
            }
            return false
        }

        // Remove any forced width or any other style
        if (node.nodeName.toLowerCase() === 'figure') node.removeAttribute('style')

        // Center images
        const img: HTMLImageElement | null = node.querySelector('img')
        if (img) {
            img.setAttribute('loading', 'lazy')
        }

        // External links
        const links: NodeListOf<HTMLAnchorElement> | null = node.querySelectorAll('a')
        links.forEach((link: HTMLAnchorElement) => {
            link.setAttribute('target', '_blank')
            link.setAttribute('rel', 'noopener')
        })

        // Clean any inline style
        let cleaned = node.outerHTML
            // remove inline styles
            .replace(/style=("|').*("|')/gi, '')
            // replace podcast time list with custom links
            .replace(/\d{2}:\d{2}:\d{2}/gi, '<a class="audio-link">$&</a>')

        text.push(cleaned)
    })

    const sources: AudioSource[] = []
    const regex: RegExp = /(apple|ivoox|spotify|google|podimo)/i
    if (sourcesList) {
        sourcesList.forEach((node) => {
            if (!regex.test(node.host)) return
            sources.push({
                name: node.textContent,
                url: node.href,
            })
        })
    }

    return {
        content: text.join(''),
        audio: audio?.src,
        sources,
        title,
        slug,
        firstImage,
    }
}

/**
 * Utility function to format images
 *
 */
type PostImage = {
    width: number
    height: number
    file?: string
    source_url: string
}

type PostImageData = {
    thumbnail: PostImage
    medium: PostImage
    full: PostImage
    srcset: string
    sizes: string
    caption: string
}

export const getPostImages = (embed: any, defaultImage?: PodcastData['firstImage']): PostImageData => {
    let images = embed['wp:featuredmedia']?.[0] || defaultImage
    let { thumbnail, medium, full }: Pick<PostImageData, 'thumbnail' | 'medium' | 'full'> =
        images.media_details?.sizes || {}

    const defaultImageValues = {
        source_url: images?.source_url,
        width: images?.media_details?.width,
        height: images?.media_details?.height,
    }

    // Ensure there's the 3 image sizes even if they are the same
    if (!images?.media_details?.sizes?.thumbnail) thumbnail = defaultImageValues
    if (!images?.media_details?.sizes?.medium) medium = defaultImageValues
    if (!images?.media_details?.sizes?.full) full = defaultImageValues

    return {
        thumbnail,
        medium,
        full,
        srcset: `${thumbnail.source_url} ${thumbnail.width}w, ${medium.source_url} ${medium.width}w, ${full.source_url} ${full.width}w`,
        sizes: `(max-width: ${thumbnail.width}px) ${thumbnail.width}px, (max-width: ${medium.width}px) ${medium.width}px, (max-width: ${full.width}px) ${full.width}px`,
        caption: images.media_details.caption,
    }
}

/**
 * Utility function to clean & extract the post data we want
 *
 */
type Post = PodcastData & {
    id: number
    author: string
    date: string
    images: PostImageData | undefined
}

export const processPosts = (posts: any): Post[] =>
    posts.map((p: any) => {
        if (cache.has(p.id)) return cache.get(p.id)
        const rawData = getPodcastdata(decode(p.content?.rendered), decode(p.title.rendered), p.slug, !p.featured_media)
        const postData = {
            id: p.id,
            author: p._embedded.author[0]?.name,
            date: new Date(p.date).toLocaleDateString(),
            ...rawData,
            images: getPostImages(p._embedded, rawData.firstImage),
        }

        cache.set(p.id, postData)
        return postData
    })
