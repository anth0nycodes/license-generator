import { execSync } from "node:child_process";

export async function getGitUsername() {
  let uncleanName = String(execSync("git config user.name"));
  let name = "";

  if (uncleanName.includes("\n")) {
    name = uncleanName.replace(/\r?\n/g, "");
  }

  return name;
}
