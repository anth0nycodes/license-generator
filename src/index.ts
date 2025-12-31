#!/usr/bin/env node

import { program } from "commander";
import {
  intro,
  outro,
  select,
  spinner,
  isCancel,
  cancel,
} from "@clack/prompts";
import inquirer from "inquirer";
import { getLicenseContent, getLicenses } from "./license.js";
import color from "picocolors";
import { getGitUsername } from "./helpers.js";

const main = async () => {
  program
    .name("License Generator")
    .description(
      "A CLI application that generates open-source licenses for your repositories.",
    )
    .version("0.1.0");

  program.parse();

  intro(color.greenBright("License Generator"));

  const BASE_URL = "https://api.github.com/licenses";
  const licenses = await getLicenses();

  // List all available licenses from github api
  const licenseOption = await select({
    message: "Choose from one of the license options below.",
    options: licenses.map((license) => ({
      value: license.key,
      label: license.name,
    })),
  });

  if (isCancel(licenseOption)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // Grab the inputs for name and year
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter name:",
      default: getGitUsername(),
      validate(value) {
        if (value.length === 0) return "A value is required!";
        return true;
      },
    },
    {
      type: "input",
      name: "year",
      message: "Enter year:",
      default: String(new Date().getFullYear()),
      validate(value) {
        if (value.length === 0) return "A value is required!";
        return true;
      },
    },
  ]);

  // Grab the content of the selected license
  const licenseOptionContent = await getLicenseContent(
    `${BASE_URL}/${String(licenseOption)}`,
  );

  // TODO: write a LICENSE file with the content using fs
  console.log(licenseOptionContent);

  outro("Successfully terminated program.");
};

try {
  main();
} catch (error) {
  console.log(`Error in main: ${error}`);
}
