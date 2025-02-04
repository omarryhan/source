import { ThemeProvider } from 'theme-ui'
import { theme } from '../theme'

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
}

export const decorators = [
    (Story) => (
        <ThemeProvider theme={theme}>
            <div
                sx={{
                    backgroundColor: 'gray.2',
                }}
            >
                <Story />
            </div>
        </ThemeProvider>
    ),
]
