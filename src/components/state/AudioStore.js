import { createContext, useReducer } from 'react'

// Storage constants
export const VOLUME_KEY = 'msdos-player-volume'
export const PROG_KEY = 'msdos-progress'

// Actions
const SET_AUDIO_DATA = 'set-audio-data'
const STORE_AUDIO_PROGRESS = 'store-audio-progress'
const STORE_VOLUME = 'store-volume'

export const setAudioData = (id, file, title, thumb, autoplay) => ({
    type: SET_AUDIO_DATA,
    payload: { id: parseInt(id), file, title, thumb, autoplay },
})

export const setAudioProgress = (id, value) => ({
    type: STORE_AUDIO_PROGRESS,
    payload: { id: parseInt(id), value },
})

export const storeVolume = (value) => ({
    type: STORE_VOLUME,
    payload: value,
})

// State
const defaultState = {
    title: null,
    file: null,
    thumb: null,
    offset: null,
    autoplay: null,
    volume: 1,
}

const findOffsetByID = (id) => {
    const storage = localStorage.getItem(PROG_KEY)
    const progress = storage ? JSON.parse(storage) : {}
    return progress[id]
}

const reducer = (state, action) => {
    switch (action.type) {
        /**
         * Set all data audio player needs to work and retrieve audio offset for specified file is any
         */
        case SET_AUDIO_DATA:
            return { ...state, ...action.payload, offset: findOffsetByID(action.payload.id) }
        /**
         * Store user's volume preference
         */
        case STORE_VOLUME: {
            localStorage.setItem(VOLUME_KEY, action.payload)
            return { ...state, volume: action.payload }
        }
        /**
         * Save audio offset for the next time the audio is accessed
         * This operation doesn't modifies state
         *
         */
        case STORE_AUDIO_PROGRESS: {
            const { id, value } = action.payload
            const storage = localStorage.getItem(PROG_KEY)
            const progress = storage ? JSON.parse(storage) : {}

            progress[id] = value
            if (!value) delete progress[id]
            localStorage.setItem(PROG_KEY, JSON.stringify(progress))

            return state
        }
        default:
            return state
    }
}

// Store
export const AudioStore = createContext()

// Provider
export default function AudioProvider({ initialState, children }) {
    const [state, dispatch] = useReducer(reducer, { ...defaultState, ...initialState })
    return <AudioStore.Provider value={{ state, dispatch }}>{children}</AudioStore.Provider>
}
