import { render } from '@testing-library/react'
import { AudioStore } from '../../components/state/AudioStore'
import ThemeProvider, { ThemeStore } from '../../components/state/ThemeStore'

/**
 * Render with all providers
 *
 */
const withAllProviders = ({ children }) => {
    return (
        <ThemeProvider>
            <AudioStore.Provider>{children}</AudioStore.Provider>
        </ThemeProvider>
    )
}
const renderWithProviders = (ui, options) => render(ui, { wrapper: withAllProviders, ...options })

/**
 * Render with ThemeProvider only
 *
 */
const withThemeProvider = (providerValue = {}) => {
    return ({ children }) => <ThemeStore.Provider value={providerValue}>{children}</ThemeStore.Provider>
}
const renderWithThemeProvider = (ui, options, providerValue) =>
    render(ui, { wrapper: withThemeProvider(providerValue), ...options })

/**
 * Render with AudioProvider only
 *
 */
const withAudioProvider = (providerValue = {}) => {
    return ({ children }) => <AudioStore.Provider value={providerValue}>{children}</AudioStore.Provider>
}

const renderWithAudioProvider = (ui, options, providerValue) =>
    render(ui, { wrapper: withAudioProvider(providerValue), ...options })

export * from '@testing-library/react'
export {
    renderWithProviders as render,
    renderWithThemeProvider as renderWithTheme,
    renderWithAudioProvider as renderWithAudio,
}
