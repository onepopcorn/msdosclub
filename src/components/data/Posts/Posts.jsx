import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { SlSpinner } from '@shoelace-style/shoelace/dist/react'
import classNames from 'classnames/bind'

import Tab from '../../layout/Tab'
import PostDetail from './PostDetail'
import { getPosts } from 'api/wpapi'
import AudioSources from './AudioSources/AudioSources'
import { AudioStore, setAudioData } from '../../state/AudioStore'

import styles from './Posts.module.css'
import Post from './Post'
const cx = classNames.bind(styles)

export default function Posts({ categories, queryClient }) {
    const { dispatch } = useContext(AudioStore)

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
        ['posts', { categories }],
        getPosts,
        {
            getNextPageParam: (lastPage) => lastPage.nextPage,
            refetchOnWindowFocus: false,
            retry: 3,
            refetchOnMount: false,
            cacheTime: 0,
        },
    )

    const [postsPage, setPostsPage] = useState(new Map())
    const [postData, setPostData] = useState(null)
    const [postDetailOpen, setPostDetailOpen] = useState(false)
    const prevScroll = useRef(0)
    const moreRef = useRef()

    // useEffect(() => {
    //     const cache = queryClient.getQueryCache()
    //     const data = cache.find(['posts', { categories }]).state.data
    //     if (!data) return

    //     setPostsPage(new Map())
    //     queryClient.setQueryData(['posts', { categories }], data => ({
    //         pages: [data.pages.shift()],
    //         pageParams: [data.pageParams.shift()]
    //     })
    //     )
    // }, [categories, queryClient])

    // Callback to open the global audio player
    const openPlayer = (e) => {
        const id = parseInt(e.target.dataset.id)
        const page = postsPage.get(id)
        const { audio: file, title, images } = data.pages[page].posts.find((p) => p.id === id)
        dispatch(setAudioData(id, file, title, images.thumbnail.source_url, true))
    }

    // Callback for when the detail view is opened
    const ondetailopen = (postid) => {
        const page = postsPage.get(postid)
        const postdata = data.pages[page].posts.find((p) => p.id === postid)
        setPostData(postdata)
        setPostDetailOpen(true)

        window.history.pushState({}, postdata.slug, postdata.slug)
        prevScroll.current = window.scrollY
    }

    // Callback for when the detail view is closed
    const ondetailclose = () => {
        setPostDetailOpen(false)
        setPostData(null)

        window.history.replaceState({}, '', '/')
        prevScroll.current = 0
    }

    // Infinite scroll
    useEffect(() => {
        if (!moreRef.current || postData) return
        const onIntersectionOccured = (entries) => {
            if (entries[0].isIntersecting && !isFetchingNextPage) fetchNextPage()
        }

        const observer = new IntersectionObserver(onIntersectionOccured, { rootMargin: '0% 0% 150% 0%' })
        observer.observe(moreRef.current)

        return () => observer.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moreRef.current, postData, isFetchingNextPage, fetchNextPage])

    // Store post content in a map to avoid nested loops to find it by ID
    useEffect(() => {
        if (!data?.pages.length) return

        const map = new Map(postsPage.entries())
        const lastPage = data.pages[data.pages.length - 1]
        lastPage.posts.forEach((p) => map.set(p.id, data.pages.indexOf(lastPage)))
        setPostsPage(map)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.pages])

    // Make postDetail open/close to be managed with back button
    useEffect(() => {
        window.addEventListener('popstate', ondetailclose)
        return () => window.removeEventListener('popstate', ondetailclose)
    }, [])

    // Remove any history state when categories change
    useEffect(() => {
        setPostData(null)
        setPostDetailOpen(false)
        window.history.replaceState({}, '', '/')
    }, [categories])

    // initial preloader
    if (isLoading)
        return (
            <div style={{ width: '100%', margin: '1em auto', textAlign: 'center' }}>
                <SlSpinner />
            </div>
        )

    // TODO: Create posts lists here instead of in return function

    return (
        <main className={cx('container')}>
            <Tab active={postDetailOpen ? 1 : 0} offset={postDetailOpen ? 0 : prevScroll.current}>
                <div className={cx('list')}>
                    {data.pages.map((page, i) => (
                        <Fragment key={i}>
                            {page.posts.map((post) => (
                                <Post
                                    key={post.id}
                                    post={{
                                        ...post,
                                        thumb: post.images.thumbnail.source_url,
                                        caption: post.images.caption,
                                    }}
                                    onClick={ondetailopen}
                                >
                                    {post.audio && (
                                        <AudioSources
                                            file={post.audio}
                                            id={post.id}
                                            sources={post.sources}
                                            onPlayClick={openPlayer}
                                        />
                                    )}
                                </Post>
                            ))}
                        </Fragment>
                    ))}
                    {/* spy element to know when to fetch more posts */}
                    {hasNextPage && !isFetchingNextPage && <div ref={moreRef}></div>}

                    {/* preloader for new posts */}
                    {isFetchingNextPage && (
                        <div style={{ width: '100%', margin: '1em auto', textAlign: 'center' }}>
                            <SlSpinner />
                        </div>
                    )}

                    {/* no more posts indicator */}
                    {!hasNextPage && (
                        <div style={{ margin: '1em auto', textAlign: 'center', color: 'var(--sl-color-neutral-400)' }}>
                            •
                        </div>
                    )}
                </div>
                {postData && (
                    <PostDetail
                        {...postData}
                        beforeContent={
                            postData?.audio && (
                                <AudioSources
                                    file={postData.audio}
                                    id={postData.id}
                                    sources={postData.sources}
                                    onPlayClick={openPlayer}
                                />
                            )
                        }
                        close={() => window.history.back()}
                    >
                        {postData.content}
                    </PostDetail>
                )}
            </Tab>
        </main>
    )
}
