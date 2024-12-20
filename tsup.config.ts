import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.tsx'],
	sourcemap: true,
	clean: true,
	dts: true,
	minify: false,
	format: ['esm', 'cjs'],
	outDir: 'dist',
})
