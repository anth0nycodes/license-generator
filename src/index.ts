#!/usr/bin/env node

import { program } from "commander";
import { intro, select, isCancel, cancel } from "@clack/prompts";
import inquirer from "inquirer";
import { createLicense, getLicenseContent, getLicenses } from "./license.js";
import color from "picocolors";
import { getGitUsername } from "./helpers.js";
import { getConfig, setConfig } from "./helpers.js";
import { BASE_URL } from "./constants.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

const main = async () => {
  const licenses = await getLicenses();

  program
    .name("License Generator")
    .description(
      "A CLI application that generates open-source licenses for your repositories.",
    )
    .version(packageJson.version);

  program
    .option("--ls, --list", "list all available license keys")
    .option(
      "-q, --quick",
      "alternative to interactive mode, generate a license using the saved default license",
    )
    .option(
      "--sl, --set-license <license>",
      "set a default license for -q / --quick option",
    )
    .option(
      "--sa, --set-author <author>",
      "set a default author for -q / --quick option",
    );

  program.parse();

  const opts = program.opts();

  // Lists all available license keys
  if (opts.list) {
    const availableLicenseKeys = licenses
      .map((license) => `${color.yellow(license.name)}: ${license.key}`)
      .join("\n");
    console.log(`Available license keys:\n${availableLicenseKeys}`);
    process.exit(0);
  }

  let configUpdated = false;

  // Sets a default license
  if (opts.setLicense) {
    const licenseKey = opts.setLicense.toLowerCase();
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
    configUpdated = true;
  }

  // Sets a default author
  if (opts.setAuthor) {
    const author = opts.setAuthor;
    await setConfig({ defaultAuthor: author });
    console.log(`Default author set to: ${color.blueBright(author)}`);
    configUpdated = true;
  }

  // Skips interactive mode and generates a license with the saved default license
  if (opts.quick) {
    const config = await getConfig();
    let name = config.defaultAuthor || getGitUsername();
    let year = String(new Date().getFullYear());
    let licenseKey = config.defaultLicense || "mit";

    const licenseOptionContent = await getLicenseContent(
      `${BASE_URL}/${licenseKey}`,
    );

    try {
      await createLicense(licenseOptionContent, year, name);
      process.exit(0);
    } catch (error) {
      console.error(`Error occurred in createLicense: ${error}`);
      throw error;
    }
  }

  if (configUpdated) {
    console.log(`Use --quick to generate with this license.`);
    return;
  }

  // Interactive mode
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
