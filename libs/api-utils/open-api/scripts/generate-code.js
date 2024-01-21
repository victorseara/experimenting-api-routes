import fs from 'fs';
import path from 'path';
import { chooseSpec } from './choose-specs.js';
import { downloadSpec } from './download-spec.js';
import { generateTypes } from './generate-types.js';
import { optimizeSpec } from './optimize-spec.js';
import ora from 'ora';

const selectedSpecs = await chooseSpec();

if (selectedSpecs.length === 0) {
  console.info('No spec selected, exiting');
}

const typesOutputDir = path.resolve(
  process.cwd(),
  './libs/api-utils/open-api/src/types'
);

const definitionsOutputDir = path.resolve(
  process.cwd(),
  './libs/api-utils/open-api/src/definitions'
);

const downloadTempOutputDir = fs.mkdtempSync('.temp-');

try {
  for (const spec of selectedSpecs) {
    try {
      await downloadSpec({
        name: spec.name,
        url: spec.value,
        outputDir: downloadTempOutputDir,
      });

      await generateTypes({
        name: spec.name,
        directory: downloadTempOutputDir,
        outputDir: typesOutputDir,
      });

      await optimizeSpec({
        name: spec.name,
        directory: downloadTempOutputDir,
        outputDir: definitionsOutputDir,
      });
    } catch (error) {
      ora().warn(`The spec ${spec.name} was not processed.`);
    }
  }
} catch (error) {
  fs.rm(typesOutputDir, { recursive: true });
  fs.rm(definitionsOutputDir, { recursive: true });

  console.error(
    "Couldn't finish the process. All changes were reverted.",
    error
  );
} finally {
  fs.rmSync(downloadTempOutputDir, { recursive: true });
}
