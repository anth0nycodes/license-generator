#!/usr/bin/env node

import { program } from "commander";
import { intro, select, isCancel, cancel } from "@clack/prompts";
import inquirer from "inquirer";
import { createLicense, getLicenseContent, getLicenses } from "./license.js";
import color from "picocolors";
import { getGitUsername } from "./helpers.js";
import { getConfig, setConfig } from "./helpers.js";

const main = async () => {
  const BASE_URL = "https://api.github.com/licenses";
  const licenses = await getLicenses();

  program
    .name("License Generator")
    .description(
      "A CLI application that generates open-source licenses for your repositories.",
    )
    .option(
      "--ls, --list",
      "list all available license keys that can be used to set a default license in quick mode",
    )
    .version("0.1.3");

  // --quick option for power users
  program
    .option(
      "-q, --quick",
      "Use saved default license with current date & GitHub username",
    )
    .option("-s, --set <license>", "Set default license for --quick option");

  program.parse();

  const opts = program.opts();

  if (opts.set) {
    const licenseKey = opts.set.toLowerCase();

    // validate
    const isValid = licenses.some((l) => l.key === licenseKey);

    if (!isValid) {
      console.error(`Error: "${licenseKey}" is not a valid license.`);
      console.error(
        "Available licenses:",
        licenses.map((l) => l.key).join(", "),
      );
      process.exit(1);
    }

    await setConfig({ defaultLicense: licenseKey });
    console.log(`Default license set to: ${color.blueBright(licenseKey)}`);
    console.log(`Use --quick to generate with this license.`);
    return;
  }

  if (opts.quick) {
    let name: string;

    // in case user hasn't set git config
    try {
      name = getGitUsername();
    } catch (error) {
      console.error("Error: Git username not configured.");
      console.error("Please run: git config --global user.name 'Your Name'");
      process.exit(1);
    }
    let year = String(new Date().getFullYear());
    let answers = { name, year };
    const config = await getConfig();
    let licenseKey = config.defaultLicense || "mit";
    const licenseOptionContent = await getLicenseContent(
      `${BASE_URL}/${licenseKey}`,
    );
    try {
      await createLicense(licenseOptionContent, answers.year, answers.name);
    } catch (error) {
      console.error(`Error occurred in createLicense: ${error}`);
      throw error;
    }
    return;
  }

  // Lists all available license keys to be set as a default for future quick mode license generation
  if (opts.list) {
    const availableLicenseKeys = licenses
      .map((license) => `${color.yellow(license.name)}: ${license.key}`)
      .join("\n");
    console.log(`Available license keys:\n${availableLicenseKeys}`);
    process.exit(0);
  }

  intro(color.blueBright("License Generator"));

  // List all available licenses from github api
  const licenseOption = await select({
    message: "Select a license:",
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
  let answers: { name: string; year: string };

  try {
    answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter name:",
        default: getGitUsername(),
        validate(value) {
          if (value.length === 0) return "Name is required";
          return true;
        },
      },
      {
        type: "input",
        name: "year",
        message: "Enter year:",
        default: String(new Date().getFullYear()),
        validate(value) {
          if (value.length === 0) return "Year is required";
          if (!/^\d{4}$/.test(value)) return "Please enter a valid year!";
          return true;
        },
      },
    ]);
  } catch (error) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // Grab the content of the selected license
  const licenseOptionContent = await getLicenseContent(
    `${BASE_URL}/${String(licenseOption)}`,
  );

  // Write LICENSE file
  try {
    await createLicense(licenseOptionContent, answers.year, answers.name);
  } catch (error) {
    console.error(`Error occurred in createLicense: ${error}`);
    throw error;
  }
};

try {
  main();
} catch (error) {
  console.error(`Error in main: ${error}`);
}
