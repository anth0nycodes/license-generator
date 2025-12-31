import { execSync } from "node:child_process";
import { constants } from "node:fs";
import { access } from "node:fs/promises";

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
