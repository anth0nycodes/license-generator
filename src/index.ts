#!/usr/bin/env node

import { program } from "commander";
import {
  intro,
  outro,
  select,
  text,
  confirm,
  spinner,
  isCancel,
  cancel,
} from "@clack/prompts";
import { getLicenseContent, getLicenses } from "./license";

const main = async () => {
  program
    .name("License Generator")
    .description(
      "A CLI application that generates open-source licenses for your repositories.",
    )
    .version("0.1.0");

  intro("License Generator");

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

  // Grab the content of the selected license
  const licenseOptionContent = await getLicenseContent(
    `${BASE_URL}/${String(licenseOption)}`,
  );
  console.log(licenseOptionContent);

  outro("Successfully terminated program.");

  program.parse();
};

try {
  main();
} catch (error) {
  console.log(`Error in main: ${error}`);
}
