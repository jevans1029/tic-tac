import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        register: './register.html'  // 👈 Add this line
      }
    }
  }
});
