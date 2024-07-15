import { createContext, useReducer } from 'react'

/**
 * Storage constants
 *
 */
export const VOLUME_KEY = 'msdos-player-volume'
export const PROG_KEY = 'msdos-progress'
export const FINISHED_KEY = 'msdos-finished'

/**
 * Actions
 *
 */
const SET_AUDIO_DATA = 'set-audio-data'
const STORE_AUDIO_PROGRESS = 'store-audio-progress'
const STORE_VOLUME = 'store-volume'

export const setAudioData = (id, file, title, thumb, autoplay) => ({
    type: SET_AUDIO_DATA,
    payload: { id: parseInt(id), file, title, thumb, autoplay },
})

export const setAudioProgress = (id, elapsed, duration) => ({
    type: STORE_AUDIO_PROGRESS,
    payload: { id: parseInt(id), elapsed: parseFloat(elapsed), duration: parseFloat(duration) },
})

export const storeVolume = (value) => ({
    type: STORE_VOLUME,
    payload: value,
})

/**
 * State
 *
 */
const defaultState = {
    title: null,
    file: null,
    thumb: null,
    offset: null,
    autoplay: null,
    volume: 1,
    progress: {},
    finished: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        /**
         * Set all data audio player needs to work and retrieve audio offset for specified file is any
         *
         */
        case SET_AUDIO_DATA:
            return { ...state, ...action.payload, offset: state.progress[action.payload.id]?.elapsed || 0 }
        /**
         * Store user's volume preference
         *
         */
        case STORE_VOLUME: {
            // prevent setting a non-numeric value
            if (!isFinite(parseFloat(action.payload))) return
            localStorage.setItem(VOLUME_KEY, action.payload)
            return { ...state, volume: action.payload }
        }
        /**
         * Save audio offset for the next time the audio is accessed
         *
         */
        case STORE_AUDIO_PROGRESS: {
            const { id, elapsed, duration } = action.payload
            const progress = { ...state.progress }
            const finished = [...state.finished]
            const isFinished = duration - elapsed <= 60

            progress[id] = { elapsed, duration }

            // Remove from storage if progress 0 or less than 30s to finish
            if (isFinished || !elapsed) delete progress[id]

            // Mark it as finished if less than 5% of duration has been reached
            if (isFinished && !finished.includes(id)) finished.push(id)

            localStorage.setItem(PROG_KEY, JSON.stringify(progress))
            localStorage.setItem(FINISHED_KEY, JSON.stringify(finished))
            return { ...state, progress, finished }
        }
        default:
            return state
    }
}

/**
 * Store
 *
 */
export const AudioStore = createContext()

/**
 * Provider
 *
 */
export default function AudioProvider({ initialState, children }) {
    // Assing non undefined or null initial state values
    Object.keys(defaultState).forEach((key) => {
        if (!initialState || !initialState[key]) return
        defaultState[key] = JSON.parse(initialState[key])
    })

    const [state, dispatch] = useReducer(reducer, defaultState)
    return <AudioStore.Provider value={{ state, dispatch }}>{children}</AudioStore.Provider>
}
