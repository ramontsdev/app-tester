const { defaultTheme } = require('./src/app/styles/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: defaultTheme.colors,
		},
	},
	plugins: [],
}
