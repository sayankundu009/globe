import { defineConfig } from "vite"
import packageJson from "./package.json";

export default defineConfig({
    build: {
        assetsDir: '',
        sourcemap: false,
        copyPublicDir: true,
        emptyOutDir: false,
        lib: {
            entry: 'main.js',
            formats: ['iife'],
            name: 'GlobeJs',
            fileName: () => `globe-v${packageJson.version}.js`
        }
    }
})