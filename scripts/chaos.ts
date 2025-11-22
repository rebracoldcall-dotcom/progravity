// Type declarations for Node.js runtime
declare const __dirname: string;

// Minimal type shims for Node.js modules (avoid needing @types/node)
interface FsModule {
  existsSync(path: string): boolean;
  readdirSync(path: string): string[];
  writeFileSync(path: string, data: string): void;
}
interface PathModule {
  join(...paths: string[]): string;
}

const fs: FsModule = require("fs");
const path: PathModule = require("path");

const TARGET_DIR = path.join(__dirname, "../packages/ui/src/components");

function unleashChaos() {
  console.log("😈 Unleashing Chaos...");

  if (!fs.existsSync(TARGET_DIR)) {
    console.log("Target not found. Chaos averted.");
    return;
  }

  const files = fs.readdirSync(TARGET_DIR);
  if (files.length === 0) return;

  // Simulate a random file corruption
  const randomFile = files[Math.floor(Math.random() * files.length)];
  const filePath = path.join(TARGET_DIR, randomFile);

  console.log(`🔥 Corrupting ${randomFile}...`);
  // In a real scenario, we might delete or modify. For safety, we just log.
  // fs.writeFileSync(filePath, "CORRUPTED BY CHAOS MONKEY");
}

unleashChaos();
