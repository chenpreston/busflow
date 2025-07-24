const fs = require('fs');
const path = require('path');

const directoryToCache = './timetables'; // 假设你的静态文件都在 public 目录下
const outputFilePath = './timetables/cache-manifest.js'; // 生成的缓存清单文件

function getFiles(dir, files = []) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      getFiles(res, files);
    } else {
      // 移除目录前缀，只保留相对于 public 目录的路径
      const relativePath = path.relative(directoryToCache, res).replace(/\\/g, '/');
      files.push(relativePath);
    }
  }
  return files;
}

const filesToCache = getFiles(directoryToCache);
// 将文件列表转换为 Service Worker 可以直接使用的格式
const manifestContent = `const ASSETS_TO_CACHE = ${JSON.stringify(filesToCache, null, 2)};`;

fs.writeFileSync(outputFilePath, manifestContent, 'utf8');
console.log(`Cache manifest generated at: ${outputFilePath}`);
console.log('Files to cache:', filesToCache);