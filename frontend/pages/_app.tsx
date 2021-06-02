// @ts-nocheck
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import { theme } from '../theme'
import { AppProvider } from '../state/app.js'

function App({ Component, pageProps }: AppProps) {
    return (
        // @ts-ignore: Unreachable code error
        <ThemeProvider theme={theme}>
            <AppProvider>
                <Component {...pageProps} />
            </AppProvider>
        </ThemeProvider>
    )
}

export default App
