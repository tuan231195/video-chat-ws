import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as dns from 'dns';

dns.setDefaultResultOrder('verbatim');
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
});
