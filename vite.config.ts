import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LinguaReact',
      fileName: 'lingua-react',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', '@inertiajs/react'],
      output: {
        globals: {
          react: 'React',
          '@inertiajs/react': 'InertiaReact',
        },
      },
    },
    sourcemap: true,
  },
});
