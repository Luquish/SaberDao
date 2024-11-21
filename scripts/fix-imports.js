const { glob } = require('glob');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');

async function findFileInProject(filename) {
  // Remove extension if present
  const baseName = path.basename(filename).replace(/\.(ts|tsx|js|jsx)$/, '');

  // Search for all possible matches
  const possibleFiles = await glob(`src/**/${baseName}.{ts,tsx,js,jsx}`, { ignore: 'node_modules/**' });

  if (possibleFiles.length > 0) {
    // Convert the found path to our import format
    const foundPath = possibleFiles[0]
      .replace(/^src\//, '')
      .replace(/\.(ts|tsx|js|jsx)$/, '');
    return `@/src/${foundPath}`;
  }

  // Also check for index files
  const possibleIndexFiles = await glob(`src/**/${baseName}/index.{ts,tsx,js,jsx}`, { ignore: 'node_modules/**' });

  if (possibleIndexFiles.length > 0) {
    const foundPath = possibleIndexFiles[0]
      .replace(/^src\//, '')
      .replace(/\/index\.(ts|tsx|js|jsx)$/, '');
    return `@/src/${foundPath}`;
  }

  return null;
}

function findFile(basePath, fileName) {
  let results = [];

  function searchFile(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        searchFile(filePath);
      } else if (file === fileName) {
        results.push(filePath);
      }
    }
  }

  searchFile(basePath);
  return results;
}

async function fixImports() {
  const files = await glob('src/**/*.{ts,tsx,js,jsx}');

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Find all imports
    const importRegex = /from ['"]([^'"]+)['"]/g;
    const matches = [...content.matchAll(importRegex)];

    for (const match of matches) {
      const [fullMatch, importPath] = match;

      // Skip node_modules imports
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        continue;
      }

      // Remove @/src/ prefix and get the relative path
      const relativePath = importPath.replace(/^@\/src\//, '');
      const directPath = path.join(SRC_DIR, relativePath);

      // If direct path doesn't exist, search for the file
      if (!fs.existsSync(directPath + '.ts') &&
        !fs.existsSync(directPath + '.tsx') &&
        !fs.existsSync(directPath + '.js') &&
        !fs.existsSync(directPath + '.jsx') &&
        !fs.existsSync(directPath + '/index.ts') &&
        !fs.existsSync(directPath + '/index.tsx')) {
        const correctPath = await findFileInProject(path.basename(relativePath));
        if (correctPath && correctPath !== importPath) {
          content = content.replace(
            `from '${importPath}'`,
            `from '${correctPath}'`
          );
          hasChanges = true;
          console.log(`In ${file}:`);
          console.log(`  Fixed: ${importPath} → ${correctPath}`);
        }
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
    }
  }
}

fixImports().catch(console.error);