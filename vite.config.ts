import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard configuration template for direct deployments
export default defineConfig({
  plugins: [react()],
});
