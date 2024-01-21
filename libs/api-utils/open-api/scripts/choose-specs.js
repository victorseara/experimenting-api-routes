import inquirer from 'inquirer';
import dotenv from 'dotenv';

dotenv.config();

export async function chooseSpec() {
  const envVars = Object.keys(process.env);

  const swaggerVars = envVars.filter((varName) =>
    varName.startsWith('SWAGGER_')
  );

  const choices = swaggerVars.map((varName) => ({
    name: varName,
    value: process.env[varName],
  }));

  const allArg = process.argv.includes('--all');

  if (allArg) {
    return choices;
  }

  const { selectedValues } = await inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Select Swagger definitions to generate code from',
      name: 'selectedValues',
      choices: [...choices, { name: 'ALL', value: 'ALL' }],
    },
  ]);

  if (selectedValues.includes('ALL')) return choices;

  const selected = choices.filter((choice) =>
    selectedValues.includes(choice.value)
  );

  return selected;
}
