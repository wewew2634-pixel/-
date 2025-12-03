import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/plugin/controller.ts'],
  bundle: true,
  platform: 'node', // Figma runs in a JS sandbox that resembles a browser but strictly no DOM. 'node' or 'neutral' is often safer for pure logic, but 'browser' works if we avoid DOM.
  target: 'es2017',
  outfile: 'dist/code.js',
  minify: true,
}).catch(() => process.exit(1));
