import axios from "axios";
import color from "picocolors";
import { writeFile } from "node:fs/promises";
import { fileExists } from "./helpers.js";
import { cancel, confirm, spinner } from "@clack/prompts";

interface LicenseShape {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

interface LicenseContentShape {
  key: string;
  name: string;
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  body: string;
}

export async function getLicenses(): Promise<LicenseShape[]> {
  try {
    const { data }: { data: LicenseShape[] } = await axios.get(
      "https://api.github.com/licenses",
    );
    return data;
  } catch (error) {
    console.error(`Error in getLicenses: ${error}`);
    throw error;
  }
}

export async function getLicenseContent(
  url: string,
): Promise<LicenseContentShape> {
  try {
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
  } catch (error) {
    console.error(`Error in getLicenseContent: ${error}`);
    throw error;
  }
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
