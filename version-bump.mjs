import { readFileSync, writeFileSync } from "fs";

// Read the current version
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const currentVersion = manifest.version;

// Split the version into major, minor, and patch
const [major, minor, patch] = currentVersion.split(".").map(Number);

// Increment the patch version
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update the version in the manifest
manifest.version = newVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));

// Create or update the versions.json file
let versions = {};
try {
  versions = JSON.parse(readFileSync("versions.json", "utf8"));
} catch (e) {
  // If the file doesn't exist, create it
  console.log("Creating versions.json file");
}

// Add the new version
versions[newVersion] = manifest.minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, 2));

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);