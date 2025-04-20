#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Parse command-line args
const [,, moduleName, ...options] = process.argv;
if (!moduleName) {
  console.error('Error: Module name is required.');
  process.exit(1);
}

const isReact = options.includes('--react');
const isDocusaurus = options.includes('--docusaurus');
const baseDir = (isReact || isDocusaurus) ? 'apps' : 'packages';
const moduleDir = path.join(process.cwd(), baseDir, moduleName);

// Create module directory
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

// Write package.json
const pkgJson = {
  name: `@blobverse/${moduleName}`,
  version: '0.1.0',
  main: 'dist/index.js',
  scripts: {
    build: 'tsc',
    ...(isReact || isDocusaurus ? { start: 'vite' } : {})
  },
  dependencies: {},
  devDependencies: {}
};
fs.writeFileSync(
  path.join(moduleDir, 'package.json'),
  JSON.stringify(pkgJson, null, 2)
);

// Write tsconfig.json
const tsconfig = {
  extends: '../../tsconfig.json',
  compilerOptions: {
    outDir: 'dist'
  },
  include: ['src']
};
fs.writeFileSync(
  path.join(moduleDir, 'tsconfig.json'),
  JSON.stringify(tsconfig, null, 2)
);

// Create src/ and entry file
const srcDir = path.join(moduleDir, 'src');
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);
const entryExt = isReact ? 'tsx' : 'ts';
const entryPath = path.join(srcDir, `index.${entryExt}`);
const entryContent = isReact
  ? `import React from 'react';\nexport default function ${moduleName}() { return <div>${moduleName} app</div>; }\n`
  : `export const ${moduleName.replace(/[-\s]/g, '_')} = {};\n`;
fs.writeFileSync(entryPath, entryContent);

// Update pnpm-workspace.yaml if needed
const wsPath = path.join(process.cwd(), 'pnpm-workspace.yaml');
const wsLines = fs.readFileSync(wsPath, 'utf-8').split(/\r?\n/);
const pattern = `'${baseDir}/${moduleName}'`;
if (!wsLines.some(line => line.includes(pattern))) {
  const insertIndex = wsLines.findIndex(line => line.startsWith('packages:')) + 1;
  wsLines.splice(insertIndex, 0, `  - ${pattern}`);
  fs.writeFileSync(wsPath, wsLines.join('\n'));
}

// Output registry metadata for Auto-discovery
const metadata = { module: moduleName, type: isDocusaurus ? 'docusaurus' : isReact ? 'react' : 'package' };
console.log('Component Registry metadata:', JSON.stringify(metadata)); 