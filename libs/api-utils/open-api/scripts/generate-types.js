import { spawn } from 'child_process';
import fs from 'fs';
import kebabCase from 'lodash.kebabcase';
import ora from 'ora';
import path from 'path';

/**
 * Generate types for the specified Swagger spec
 * @param {Object} spec - The Swagger spec to generate types for
 * @param {string} spec.name - The name of the spec
 * @param {string} spec.url - The URL of the spec
 * @param {string} spec.directory - The directory of the spec
 * @param {string} spec.outputDir - The URL of the spec
 */
export async function generateTypes(spec) {
  const spinner = ora(`Generating types for ${spec.name}`).start();
  fs.mkdirSync(spec.outputDir, { recursive: true });
  try {
    const name = kebabCase(spec.name);
    const filePath = path.join(spec.directory, `${spec.name}.json`);
    const outputFile = fs.createWriteStream(
      path.join(spec.outputDir, `${name}.d.ts`)
    );

    const child = spawn('npx', ['openapicmd', 'typegen', filePath], {
      shell: true,
    });
    child.stdout.pipe(outputFile);

    await new Promise((resolve, reject) => {
      child.on('exit', () => {
        spinner.succeed(`Generated types for ${spec.name}`);
        resolve();
      });

      child.on('error', (error) => {
        spinner.fail(`Failed to generate types for ${spec.name}`);
        console.error(error);
        reject(error);
      });
    });
  } catch (error) {
    spinner.fail(`Failed to generate types for ${spec.name}`);
    console.error(error);
  }
}
