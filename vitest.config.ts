/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,

		coverage: {
			all: false,
			provider: 'v8',
			reporter: ['json-summary', 'html'],
			thresholds: {
				statements: 80,
				branches: 80,
				functions: 80,
				lines: 80,
			},
		},
	},
})
