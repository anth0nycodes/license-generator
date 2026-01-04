import { execSync } from "node:child_process";
import { constants } from "node:fs";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import type { Config, LicenseShape } from "./types.js";
import color from "picocolors";

export function getGitUsername(options: { fallback?: string } = {}) {
  try {
    const uncleanName = String(execSync("git config user.name"));
    return uncleanName.replace(/\r?\n/g, "");
  } catch (error) {
    if (options.fallback !== undefined) {
      return options.fallback;
    }

    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("git config user.name")) {
      console.error(
        `Error: Git username not configured. Set it with: ${color.cyan('git config --global user.name "Your Name"')}`,
      );
      process.exit(1);
    } else {
      console.error(`Error occurred in getGitUsername: ${errorMessage}`);
      process.exit(1);
    }
  }
}

export function isValidLicense(licenses: LicenseShape[], licenseKey: string) {
  return licenses.some((l) => l.key === licenseKey);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
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
  await mkdir(CONFIG_DIR, { recursive: true });
  const existingConfig = await getConfig();

  // If config has any keys, merge with existing; otherwise use config as-is (for reset)
  const updatedConfig =
    Object.keys(config).length > 0 ? { ...existingConfig, ...config } : config;

  await writeFile(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2), "utf8");
}
