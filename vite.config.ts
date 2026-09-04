import childProcess from 'node:child_process';
import fs from 'node:fs';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vuetify from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        vue(),
        vuetify(),
        createHtmlPlugin({
            minify: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                decodeEntities: true,
                removeComments: true,
                removeAttributeQuotes: false,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeEmptyAttributes: true,
                useShortDoctype: true,
                processConditionalComments: true,
                sortAttributes: true,
                sortClassName: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: false,
            },
        }),
    ],
    build: {
        emptyOutDir: true,
        chunkSizeWarningLimit: Infinity,
        minify: 'oxc',
        cssMinify: 'lightningcss',
        target: 'esnext',
        rolldownOptions: {
            plugins: [
                visualizer({
                    gzipSize: true,
                    brotliSize: true,
                }),
            ],
            output: {
                entryFileNames: 'assets/[hash].js',
                chunkFileNames: 'assets/[hash].js',
                assetFileNames: 'assets/[hash].[ext]',
            },
        },
    },
    define: {
        __COMMIT_HASH__: `"${childProcess.execSync('git rev-parse HEAD').toString().trim()}"`,
        __COMMIT_TIME__: `"${(new Date(parseInt(childProcess.execSync('git log -1 --format="%at"').toString().trim(), 10) * 1000)).toISOString()}"`,
        __VUE_VERSION__: `"Vue ${JSON.parse(fs.readFileSync('./node_modules/vue/package.json', { encoding: 'utf-8' })).version}"`,
        __VITE_VERSION__: `"Vite ${JSON.parse(fs.readFileSync('./node_modules/vite/package.json', { encoding: 'utf-8' })).version}"`,
        __VUETIFY_VERSION__: `"Vuetify ${JSON.parse(fs.readFileSync('./node_modules/vuetify/package.json', { encoding: 'utf-8' })).version}"`,
    },
});
