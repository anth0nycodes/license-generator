import axios from "axios";
import color from "picocolors";
import { writeFile } from "node:fs/promises";
import { fileExists, getErrorMessage } from "./helpers.js";
import { cancel, confirm, spinner } from "@clack/prompts";
import { BASE_URL } from "./constants.js";
import { LicenseContentShape, LicenseShape } from "./types.js";

export async function getLicenses() {
  try {
    const { data }: { data: LicenseShape[] } = await axios.get(BASE_URL);
    return data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error in getLicenses: ${errorMessage}`);
    process.exit(1);
  }
}

export async function getLicenseContent(
  url: string,
): Promise<LicenseContentShape> {
  const { data }: { data: LicenseContentShape } = await axios.get(url);
  return {
    key: data.key,
    name: data.name,
    description: data.description,
    permissions: data.permissions,
    conditions: data.conditions,
    limitations: data.limitations,
    body: data.body,
  };
}

export async function createLicense(
  content: LicenseContentShape,
  year: string,
  name: string,
) {
  let uncleanBody = content.body;

  let body = uncleanBody
    .replaceAll("[year]", year)
    .replaceAll("[yyyy]", year)
    .replaceAll("[fullname]", name)
    .replaceAll("[name of copyright owner]", name)
    .replaceAll("<year>", year)
    .replaceAll("<name of author>", name);

  if (await fileExists("LICENSE")) {
    const shouldContinue = await confirm({
      message: "LICENSE file already exists. Overwrite?",
    });

    if (!shouldContinue) {
      cancel("Operation cancelled.");
      process.exit(0);
    }
  }

  const s = spinner();
  s.start(color.yellow("Generating license..."));
  await writeFile("LICENSE", body, "utf8");
  s.stop(color.greenBright("License created!"));
}
