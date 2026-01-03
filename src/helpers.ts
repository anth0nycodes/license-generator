import { execSync } from "node:child_process";
import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import type { LicenseShape } from "./license.js";
import color from "picocolors";

export function getGitUsername() {
  try {
    const uncleanName = String(execSync("git config user.name"));
    return uncleanName.replace(/\r?\n/g, "");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("git config user.name")) {
      console.error(
        `Error: Git username not configured. Set it with: ${color.cyan('git config --global user.name "Your Name"')}`,
      );
    } else {
      console.error(`Error occurred in getGitUsername: ${errorMessage}`);
    }
    throw error;
  }
}

export function isValid(licenses: LicenseShape[], licenseKey: string) {
  return licenses.some((l) => l.key === licenseKey);
}

export async function fileExists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const CONFIG_DIR = join(homedir(), ".license-generator");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface Config {
  defaultLicense?: string;
  defaultAuthor?: string;
}

export async function getConfig(): Promise<Config> {
  try {
    const content = await readFile(CONFIG_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    // config doesn't exist yet, return empty config
    return {};
  }
}

export async function setConfig(config: Config) {
  try {
    await mkdir(CONFIG_DIR, { recursive: true });
    const existingConfig = await getConfig();
    // If config has any keys, merge with existing; otherwise use config as-is (for reset)
    const updatedConfig = Object.keys(config).length > 0
      ? { ...existingConfig, ...config }
      : config;
    await writeFile(
      CONFIG_FILE,
      JSON.stringify(updatedConfig, null, 2),
      "utf8",
    );
  } catch (error) {
    console.error(`Error occurred in setConfig: ${error}`);
    throw error;
  }
}
