import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/next';
import camelCase from 'lodash.camelcase';
import path from 'path';
import { GtiPageLibraryGeneratorSchema } from './schema';

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
    }';\n export {${camelCase(
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

  await formatFiles(tree);
}

export default gtiPageLibraryGenerator;
