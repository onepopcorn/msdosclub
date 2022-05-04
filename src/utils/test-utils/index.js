import { render } from '@testing-library/react'
import AudioProvider, { AudioStore } from 'providers/AudioStore'
import ThemeProvider, { ThemeStore } from 'providers/ThemeStore'
import MenuProvider, { MenuStore } from 'providers/MenuStore'
import { QueryClient, QueryClientProvider } from 'react-query'

/**
 * Render with all providers
 *
 */
const withAllProviders = ({ children }) => {
    return (
        <ThemeProvider>
            <MenuProvider>
                <AudioProvider>{children}</AudioProvider>
            </MenuProvider>
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

/**
 * Render with MenuProvider only
 *
 */
const withMenuProvider = (providerValue = {}) => {
    return ({ children }) => <MenuStore.Provider value={providerValue}>{children}</MenuStore.Provider>
}

const renderWithMenuProvider = (ui, options, providerValue) => {
    render(ui, { wrapper: withMenuProvider(providerValue), ...options })
}

/**
 * Render with ReactQuery Provider
 *
 */
const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            cacheTime: Infinity,
        },
    },
})

const withQueryProvider = () => {
    return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const renderWithQueryClientProvider = (ui, options) => {
    render(ui, { wrapper: withQueryProvider(), ...options })
}

export * from '@testing-library/react'
export {
    renderWithProviders as render,
    renderWithThemeProvider as renderWithTheme,
    renderWithAudioProvider as renderWithAudio,
    renderWithMenuProvider as renderWithMenu,
    renderWithQueryClientProvider as renderWithQueryClient,
    client as queryClient,
}
