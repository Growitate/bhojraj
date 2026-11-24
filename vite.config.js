import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['es2019', 'chrome87', 'firefox78', 'safari13', 'edge88'],
    cssTarget: ['chrome87', 'safari13', 'firefox78']
  },
  server: {
    host: '0.0.0.0',
    port: 1611,
    headers: {
      'Cache-Control': 'no-store'
    },
    allowedHosts: [
      'bhojrajgroup.in',
      'www.bhojrajgroup.in',
      '.bhojrajgroup.in',
      'bhojraj.cyberpunk.co.in',
      '.cyberpunk.co.in',
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 1611,
    allowedHosts: [
      'bhojrajgroup.in',
      'www.bhojrajgroup.in',
      '.bhojrajgroup.in',
      'bhojraj.cyberpunk.co.in',
      '.cyberpunk.co.in',
      'localhost',
      '127.0.0.1'
    ]
  }
});
