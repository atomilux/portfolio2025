// vitest.config.js (ensure this is the filename)
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

console.log('Vitest config loaded'); // Confirm config is read

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts', // Ensure this file exists or remove if not needed
    globals: true,
    testTimeout: 15000 // 15s global timeout
  },
});