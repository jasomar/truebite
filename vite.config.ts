import { defineConfig } from 'vite';
import { preloadFonts, renderSections } from './plugins/render-sections.ts';

const assetFileName = (asset: { names?: string[] }): string => {
  const name = asset.names?.[0] ?? '';
  if (name.endsWith('.css')) return 'assets/css/[name].[hash].min.css';
  if (name.endsWith('.woff2') || name.endsWith('.woff')) return 'assets/fonts/[name].[hash][extname]';
  return 'assets/media/[name].[hash][extname]';
};

export default defineConfig({
  plugins: [renderSections(), preloadFonts()],
  build: {
    sourcemap: true,
    modulePreload: { polyfill: false },
    rolldownOptions: {
      input: { main: 'index.html', privacidad: 'privacidad.html', terminos: 'terminos.html', notFound: '404.html' },
      output: {
        entryFileNames: 'assets/js/[name].[hash].min.js',
        chunkFileNames: 'assets/js/[name].[hash].min.js',
        assetFileNames: assetFileName,
      },
    },
  },
});
