import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.tsx'],
	sourcemap: true,
	dts: true,
	minify: false,
	format: ['esm', 'cjs'],
	outDir: 'dist',
})
