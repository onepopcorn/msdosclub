import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { SlSpinner } from '@shoelace-style/shoelace/dist/react'

import { getPosts } from 'api/wpapi'
import AudioSources from 'components/data/AudioSources'
import AudioProgress from 'components/data/AudioProgress'
import { AudioStore, setAudioData } from 'providers/AudioStore'

// Custom components
import Post from 'components/data/Posts/Post'
import Tab from 'components/layout/Tab'
import PostDetail from 'components/data/Posts/PostDetail'
import Comments from 'components/data/Comments'

// Styles
import classNames from 'classnames/bind'
import styles from './Posts.module.css'

const cx = classNames.bind(styles)

export default function Posts({ categories }) {
    const {
        state: { id: playingId, finished },
        dispatch,
    } = useContext(AudioStore)
    const queryClient = useQueryClient()
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
        ['posts', { categories }],
        getPosts,
        { getNextPageParam: (lastPage) => lastPage.nextPage },
    )

    const [postsInPage, setPostsInPage] = useState(new Map())
    const [postData, setPostData] = useState(null)
    const [postDetailOpen, setPostDetailOpen] = useState(false)
    const prevScroll = useRef(0)
    const moreRef = useRef()

    // Infinite scroll
    useEffect(() => {
        if (!moreRef.current || postData) return
        const onIntersectionOccured = (entries) => {
            if (entries[0].isIntersecting && !isFetchingNextPage) fetchNextPage()
        }

        const observer = new IntersectionObserver(onIntersectionOccured, { rootMargin: '0% 0% 120% 0%' })
        observer.observe(moreRef.current)

        return () => observer.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moreRef.current, postData, isFetchingNextPage, fetchNextPage])

    // Store post content in a map to avoid nested loops to find it by ID
    useEffect(() => {
        if (!data?.pages.length) return

        const map = new Map(postsInPage.entries())
        const lastPage = data.pages[data.pages.length - 1]
        lastPage.posts.forEach((p) => map.set(p.id, data.pages.indexOf(lastPage)))
        setPostsInPage(map)

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

        // Limit number of posts to be shown from cache to prevent render bottlenecks
        window.scrollTo({ top: 0 })
        const cache = queryClient.getQueryCache()
        const cachedData = cache.find(['posts', { categories }])
        if (!cachedData.state.data) return
        cachedData.state.data = {
            pageParams: [undefined],
            pages: cachedData.state.data.pages.slice(0, 1),
        }
    }, [categories, queryClient])

    // Callback to open the global audio player
    const openPlayer = (id) => {
        const page = postsInPage.get(id)
        const { audio: file, title, images } = data.pages[page].posts.find((p) => p.id === id)
        dispatch(setAudioData(id, file, title, images.thumbnail.source_url, true))
    }

    // Callback for when the detail view is opened
    const ondetailopen = (postid) => {
        const page = postsInPage.get(postid)
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
        // prevScroll.current = 0
    }

    // initial preloader
    if (isLoading)
        return (
            <div className={cx('spinner')}>
                <SlSpinner data-testid="spinner" />
            </div>
        )

    return (
        <main className={cx('container')}>
            <Tab active={postDetailOpen ? 1 : 0} offset={postDetailOpen ? 0 : prevScroll.current}>
                <div className={cx('list')}>
                    {data.pages.map((page, i) => (
                        <Fragment key={`${categories.toString()}-${i}`}>
                            {page.posts.map((post) => (
                                <Post
                                    key={post.id}
                                    post={{
                                        id: post.id,
                                        title: post.title,
                                        date: post.date,
                                        thumb: post.images.thumbnail.source_url,
                                        caption: post.images.caption,
                                    }}
                                    viewed={finished.includes(post.id)}
                                    isCurrent={playingId === post.id}
                                    onClick={ondetailopen}
                                >
                                    {post.audio && (
                                        <div className={cx('actions')}>
                                            <AudioProgress id={post.id} />
                                            <AudioSources file={post.audio} id={post.id} onPlayClick={openPlayer} />
                                        </div>
                                    )}
                                </Post>
                            ))}
                        </Fragment>
                    ))}
                    {/* spy element to know when to fetch more posts */}
                    {hasNextPage && !isFetchingNextPage && <div ref={moreRef}></div>}

                    {/* preloader for new posts */}
                    {isFetchingNextPage && (
                        <div className={cx('spinner')}>
                            <SlSpinner />
                        </div>
                    )}

                    {/* no more posts indicator */}
                    {!hasNextPage && <div className={cx('listend')}>•</div>}
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
                        afterContent={<Comments postId={postData.id} />}
                        close={() => window.history.back()}
                    >
                        {postData.content}
                    </PostDetail>
                )}
            </Tab>
        </main >
    )
}
