import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { gtiPageLibraryGenerator } from './generator';
import { GtiPageLibraryGeneratorSchema } from './schema';

describe('gti-page-library generator', () => {
  let tree: Tree;
  const options: GtiPageLibraryGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await gtiPageLibraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
