import { execSync } from "node:child_process";
import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

export function getGitUsername() {
  const uncleanName = String(execSync("git config user.name"));
  return uncleanName.replace(/\r?\n/g, "");
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// config reading + setting

const CONFIG_DIR = join(homedir(), ".license-generator");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface Config {
  defaultLicense?: string;
}

export async function getConfig(): Promise<Config> {
  try {
    const content = await readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    // config doesn't exist yet, return empty config
    return {};
  }
}

export async function setConfig(config: Config): Promise<void> {
  // make sure config directory exists
  await mkdir(CONFIG_DIR, { recursive: true });

  // read existing config (or empty object)
  const existing = await getConfig();

  // add new values
  const updated = { ...existing, ...config };
  await writeFile(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
}
