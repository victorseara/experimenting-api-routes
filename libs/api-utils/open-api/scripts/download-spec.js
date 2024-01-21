import axios from 'axios';
import fs from 'fs';
import ora from 'ora';
import path from 'path';

async function downloadSwaggerSchema(url, name, outputDir) {
  const spinner = ora(`Downloading ${name}`).start();
  try {
    const response = await axios.get(url);
    fs.writeFileSync(
      path.join(outputDir, `${name}.json`),
      JSON.stringify(response.data)
    );
    spinner.succeed(`Downloaded ${name}`);
  } catch (error) {
    spinner.fail(`Failed to download ${name}`);
    throw error;
  }
}

/**
 * Download the Swagger spec
 * @param {Object} spec - The Swagger spec to generate types for
 * @param {string} spec.name - The name of the spec
 * @param {string} spec.url - The URL of the spec
 * @param {string} spec.outputDir - The URL of the spec
 */
export async function downloadSpec(spec) {
  if (!spec) {
    console.error('Please provide a spec');
    return;
  }

  await downloadSwaggerSchema(spec.url, spec.name, spec.outputDir);
}
