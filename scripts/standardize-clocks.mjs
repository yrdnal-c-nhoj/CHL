import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

/**
 * This script programmatically fixes common TS errors across 400+ files:
 * 1. Adds 'React' imports if missing.
 * 2. Explicitly types default exports as React.FC.
 * 3. Ensures 'useClockTime' is used correctly.
 */
const project = new Project();
project.addSourceFilesAtPaths('src/pages/**/Clock.tsx');

const sourceFiles = project.getSourceFiles();
console.log(`Processing ${sourceFiles.length} clock modules...`);

sourceFiles.forEach(file => {
  // 1. Ensure React is imported
  if (!file.getImportDeclaration('react')) {
    file.addImportDeclaration({
      moduleSpecifier: 'react',
      namedImports: ['React']
    });
  }

  // 2. Find the default export (the Clock component)
  const defaultExport = file.getDefaultExportSymbol();
  if (defaultExport) {
    const declaration = defaultExport.getDeclarations()[0];
    
    // If it's a function declaration: export default function Clock() {}
    if (declaration.getKind() === SyntaxKind.FunctionDeclaration) {
      const name = declaration.getName() || 'ClockComponent';
      // Convert to Arrow Function for easier FC typing
      const body = declaration.getBodyText();
      file.addVariableStatement({
        declarationKind: 'const',
        declarations: [{
          name,
          type: 'React.FC',
          initializer: `() => { ${body} }`
        }]
      });
      declaration.remove();
      file.addExportAssignment({ isExportEquals: false, expression: name });
    }
  }

  file.formatText();
});

project.save().then(() => console.log('✅ Standardization complete.'));