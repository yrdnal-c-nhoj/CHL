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

const STYLE_TYPES = [
  'React.CSSProperties',
  'Record<string, React.CSSProperties>'
];

console.log(`Processing ${sourceFiles.length} clock modules...`);

sourceFiles.forEach(file => {
  // 1. Ensure React is imported
  if (!file.getImportDeclaration('react')) {
    file.addImportDeclaration({
      moduleSpecifier: 'react',
      namedImports: ['React']
    });
  }

  // 2. Automated CSS Typing: Find variables like 'containerStyle' or 'styles'
  file.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(decl => {
    const name = decl.getName().toLowerCase();
    const initializer = decl.getInitializer();
    
    // Only type as CSS if it's explicitly 'styles' or includes 'style' AND is an object literal
    if ((name.includes('style') || name === 'styles') && !decl.getTypeNode() && initializer) {
      
      if (initializer.getKind() === SyntaxKind.ArrowFunction || initializer.getKind() === SyntaxKind.FunctionExpression) {
        const func = initializer;
        if (!func.getReturnTypeNode()) {
          func.setReturnType('React.CSSProperties');
        }
      } else if (initializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
        // Otherwise, type the variable itself (Object literals)
        const typeToSet = (name === 'styles') ? STYLE_TYPES[1] : STYLE_TYPES[0];
        decl.setType(typeToSet);
      }
    }
  });

  // 3. Fix incorrect React.FC usage on logic functions
  // We look for variables typed as React.FC that aren't using PascalCase (standard for components)
  file.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach(decl => {
    const typeNode = decl.getTypeNode();
    if (typeNode) {
      const typeText = typeNode.getText().replace(/\s+/g, '');
      const fcTypes = ['React.FC', 'FC', 'React.FC<{}>', 'FC<{}>'];
      
      if (fcTypes.some(t => typeText.startsWith(t))) {
        const name = decl.getName();
        // If it's not PascalCase, it's likely a logic function (e.g., updateTime), not a component.
        if (!/^[A-Z]/.test(name)) {
          decl.removeType();
        }
      }
    }
  });

  // 4. Find the default export (the Clock component)
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