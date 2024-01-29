import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/next';
import camelCase from 'lodash.camelcase';
import path from 'path';
import { GtiPageLibraryGeneratorSchema } from './schema';
import { tsquery } from '@phenomnomnominal/tsquery';
import ts from 'typescript';
import { EOL } from 'node:os';

function pascalCase(val: string) {
  return val[0].toUpperCase() + camelCase(val).slice(1);
}

export async function gtiPageLibraryGenerator(
  tree: Tree,
  options: GtiPageLibraryGeneratorSchema
) {
  const libraryRoot = `libs/pages/${options.name}`;

  await libraryGenerator(tree, {
    name: options.name,
    style: 'none',
    linter: 'eslint',
    unitTestRunner: 'jest',
    directory: 'libs/pages',
    tags: `scope:${options.name},type:page`,
    strict: true,
  });

  tree.delete(`${libraryRoot}/src/lib`);

  generateFiles(tree, path.join(__dirname, 'files'), libraryRoot, {
    ...options,
    camelCase,
    pascalCase,
  });

  tree.write(
    `${options.route}.tsx`,
    `export { ${pascalCase(options.name)}Page as default } from '@self/pages/${
      options.name
    }';${EOL} export {${camelCase(
      options.name
    )}SsrProps as getServerSideProps} from '@self/pages/${options.name}';`
  );

  /* @to-do use AST to modify the router properly */
  /*   tree.write(
    `${options.api}/[...api].ts`,
    `import {Get${pascalCase(options.name)}Route} from '@self/pages/${
      options.name
    }/server'`
  ); */

  function registerRoute(node: ts.Node) {
    const text = node.getText();
    const entries = text
      .replace('{', '')
      .replace('}', '')
      .trim()
      .split(',')
      .filter(Boolean);

    const newEntry = `[Get${pascalCase(
      options.name
    )}Config.injectionKey]: Get${pascalCase(options.name)}Route,`;

    entries.push(newEntry);

    return `{${entries.join(',')}}`;
  }

  function registerNewService(node: ts.Node) {
    const text = node.getText();
    const isServicesProperty = text.toLowerCase().includes('service');
    if (isServicesProperty) {
      const entries = text.replace('[', '').replace(']', '').split(',');
      const newEntry = `Get${pascalCase(options.name)}Service`;
      entries.push(newEntry);

      return `[${entries.join(',')}]`;
    }

    return node.getText();
  }

  tree.children(`${options.api}`).forEach((fileName) => {
    if (fileName === '[...api].ts') {
      const content = tree.read(`${options.api}/${fileName}`).toString();

      const withNewRoutes = tsquery.replace(
        content,
        'ObjectLiteralExpression:nth-child(3)',
        registerRoute
      );

      const withNewServices = tsquery.replace(
        withNewRoutes,
        'ArrayLiteralExpression',
        registerNewService
      );

      const withImports = tsquery.replace(
        withNewServices,
        'ImportDeclaration:nth-last-child(3)',
        (node) => {
          const text = node.getText();

          const newEntry = `import { Get${pascalCase(
            options.name
          )}Config, Get${pascalCase(options.name)}Route, Get${pascalCase(
            options.name
          )}Service } from '@self/pages/${options.name}/server';`;

          return text.concat('\n', newEntry);
        }
      );

      if (withImports !== content) {
        tree.write(`${options.api}/${fileName}`, withNewServices);
      }
    }
  });

  await formatFiles(tree);
}

export default gtiPageLibraryGenerator;
