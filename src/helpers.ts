import { execSync } from "node:child_process";
import { constants } from "node:fs";
import { access } from "node:fs/promises";

export function getGitUsername() {
  let uncleanName = String(execSync("git config user.name"));
  let name = "";

  if (uncleanName.includes("\n")) {
    name = uncleanName.replace(/\r?\n/g, "");
  }

  return name;
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
