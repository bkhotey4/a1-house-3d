// 把網頁版 index.html 複製成 App 用的 www/，three.js 改成內建檔案，不連網也能開 3D 模型
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const www = path.join(import.meta.dirname, 'www');
const three = path.join(import.meta.dirname, 'node_modules', 'three');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cdn = 'https://cdn.jsdelivr.net/npm/three@0.160.0/';
if (!html.includes(cdn)) throw new Error('index.html 找不到 three.js CDN 路徑，請確認 importmap');
html = html.split(cdn).join('./vendor/three/');
fs.writeFileSync(path.join(www, 'index.html'), html);

const files = [
  'build/three.module.js',
  'examples/jsm/controls/OrbitControls.js',
  'examples/jsm/environments/RoomEnvironment.js',
  'examples/jsm/renderers/CSS2DRenderer.js',
];
for (const f of files) {
  const dst = path.join(www, 'vendor', 'three', f);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(three, f), dst);
}
console.log('www 已產生：', fs.readdirSync(www));
