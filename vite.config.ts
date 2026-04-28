import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

import path from 'node:path';

process.env.VITE_SHOELACE_PREFIX =
    process.env.NODE_ENV === 'development'
        ? '/node_modules/@shoelace-style/shoelace/dist'
        : '/shoelace/node_modules/@shoelace-style/shoelace/dist';

export default defineConfig({
    publicDir: 'public',
    build: {
        outDir: 'build',
        emptyOutDir: true,
    },
    server: {
        open: true,
        port: 3000,
    },
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'public/manifest.json',
                    dest: '.',
                },
                {
                    src: 'node_modules/@shoelace-style/shoelace/dist/assets/icons/*.svg',
                    dest: 'shoelace',
                },
                {
                    src: 'node_modules/@shoelace-style/shoelace/dist/themes/*.css',
                    dest: 'shoelace',
                },
            ],
        }),
        svgr(),
    ],
    resolve: {
        alias: {
            providers: path.resolve(__dirname, './src/providers'),
            components: path.resolve(__dirname, './src/components'),
            api: path.resolve(__dirname, './src/api'),
            hooks: path.resolve(__dirname, './src/hooks'),
            utils: path.resolve(__dirname, './src/utils'),
            assets: path.resolve(__dirname, './src/assets'),
            'test-utils': path.resolve(__dirname, './src/test-utils'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
});
