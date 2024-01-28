import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/next';
import { GtiPageLibraryGeneratorSchema } from './schema';
import path from 'path';
import camelCase from 'lodash.camelcase';

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

  generateFiles(tree, path.join(__dirname, 'files'), libraryRoot, {
    ...options,
    camelCase,
  });

  await formatFiles(tree);
}

export default gtiPageLibraryGenerator;
