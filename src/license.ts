import axios from "axios";

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
    const { data } = await axios.get("https://api.github.com/licenses");
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
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(`Error in getLicenseContent: ${error}`);
    throw error;
  }
}
