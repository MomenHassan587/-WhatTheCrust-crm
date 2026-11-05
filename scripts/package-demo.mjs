import { cp, writeFile, readdir, stat, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const destination = path.resolve('dist-demo');
const catalog = JSON.parse(await readFile('resources/js/demo/catalog.json', 'utf8'));
const assets = new Set(['images/logo.png', 'videos/hero-pizza-motion.mp4']);
for (const item of catalog.items) {
    if (item.image_path) assets.add(item.image_path.replace(/^\//, ''));
}
for (const asset of assets) {
    const source = path.resolve('public', asset);
    const target = path.resolve(destination, asset);
    if (!source.startsWith(path.resolve('public') + path.sep) || !target.startsWith(destination + path.sep)) {
        throw new Error('Invalid demo asset path: ' + asset);
    }
    await mkdir(path.dirname(target), { recursive: true });
    await cp(source, target);
}
await writeFile(path.join(destination, '_redirects'), '/* /index.html 200\n');
await writeFile(path.join(destination, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
async function checkFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) await checkFiles(target);
        else if ((await stat(target)).size > 25 * 1024 * 1024) throw new Error('Cloudflare file limit exceeded: ' + target);
    }
}
await checkFiles(destination);
console.log('Upload dist-demo to Cloudflare Pages. PHP, .env, and database files are excluded.');
