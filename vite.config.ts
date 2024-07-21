import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

import path from 'node:path';

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
        svgr(),
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'public/manifest.json',
                    dest: path.join(__dirname, 'build/'),
                },
                {
                    src: 'node_modules/@shoelace-style/shoelace/dist/assets/icons/*.svg',
                    dest: path.join(__dirname, 'build/shoelace/assets/icons'),
                },
                {
                    src: 'node_modules/@shoelace-style/shoelace/dist/themes/*.css',
                    dest: path.join(__dirname, 'build/shoelace/themes'),
                },
            ],
        }),
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
