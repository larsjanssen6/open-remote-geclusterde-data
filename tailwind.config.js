const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
    theme: {
        extend: {
            colors: {
                blue: {
                    ...colors.blue,
                    '700': '#0052ff',
                    '800': '#0069ff',
                    '900': '#031b4d',
                }
            }
        }
    },
    variants: {},
    plugins: []
}
