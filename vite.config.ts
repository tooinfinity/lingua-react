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
      external: [
        'react',
        'react/jsx-runtime',
        '@inertiajs/react',
        'lucide-react',
        '@radix-ui/react-dropdown-menu',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          '@inertiajs/react': 'InertiaReact',
          'lucide-react': 'LucideReact',
          '@radix-ui/react-dropdown-menu': 'RadixDropdownMenu',
          clsx: 'clsx',
          'tailwind-merge': 'tailwindMerge',
        },
      },
    },
    sourcemap: true,
  },
});
