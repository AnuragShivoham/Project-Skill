const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react-swc');
const path = require('path');

// Try to load lovable-tagger safely; fallback if not available
let componentTagger = null;
try {
  // Some packages may export as ESM; require may fail silently
  const tagger = require('lovable-tagger');
  componentTagger = tagger && tagger.componentTagger ? tagger.componentTagger : null;
} catch (e) {
  // package not installed or cannot be required in CJS; ignore
}

module.exports = defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
