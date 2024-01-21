import { spawn } from 'child_process';
import fs from 'fs';
import kebabCase from 'lodash.kebabcase';
import ora from 'ora';
import path from 'path';

/**
 * Optimize Swagger spec
 * @param {Object} spec - The Swagger spec to generate types for
 * @param {string} spec.name - The name of the spec
 * @param {string} spec.directory - The directory of the spec
 * @param {string} spec.outputDir - The output dir for the optimized spec
 */
export async function optimizeSpec(spec) {
  const spinner = ora(`Optimizing ${spec.name}`).start();
  fs.mkdirSync(spec.outputDir, { recursive: true });
  try {
    const filePath = path.join(spec.directory, `${spec.name}.json`);
    const outputFile = fs.createWriteStream(
      path.join(spec.outputDir, `${kebabCase(spec.name)}.json`)
    );

    const child = spawn(
      'npx',
      [
        'openapicmd',
        'read',
        '--strip',
        'openapi_client_axios',
        '--format',
        'json',
        filePath,
      ],
      { shell: true }
    );
    child.stdout.pipe(outputFile);

    await new Promise((resolve, reject) => {
      child.on('exit', () => {
        spinner.succeed(`Optimized ${spec.name}`);
        resolve();
      });

      child.on('error', (error) => {
        spinner.fail(`Failed to optimize ${spec.name}`);
        console.error(error);
        reject(error);
      });
    });
  } catch (error) {
    spinner.fail(`Failed to optimize ${spec.name}`);
    console.error(error);
  }
}
