// Licenses
export interface LicenseShape {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface LicenseContentShape {
  key: string;
  name: string;
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  body: string;
}

// Config
export interface Config {
  defaultLicense?: string;
  defaultAuthor?: string;
}
