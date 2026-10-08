import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

function getFiles(dir: string, fileList: string[] = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getFiles("src");

const replacements = [
  // Backgrounds
  { pattern: /\bbg-white\b/g, replacement: "bg-card" },
  { pattern: /\bbg-neutral-50\b/g, replacement: "bg-secondary" },
  { pattern: /\bbg-neutral-100\b/g, replacement: "bg-muted" },
  { pattern: /\bbg-slate-50\b/g, replacement: "bg-secondary" },
  { pattern: /\bbg-slate-100\b/g, replacement: "bg-muted" },
  { pattern: /\bbg-gray-50\b/g, replacement: "bg-secondary" },
  { pattern: /\bbg-gray-100\b/g, replacement: "bg-muted" },

  // Hover Backgrounds
  {
    pattern: /\bhover:bg-neutral-50\b/g,
    replacement: "hover:bg-accent hover:text-accent-foreground",
  },
  {
    pattern: /\bhover:bg-neutral-100\b/g,
    replacement: "hover:bg-accent hover:text-accent-foreground",
  },
  {
    pattern: /\bhover:bg-neutral-200\b/g,
    replacement: "hover:bg-accent hover:text-accent-foreground",
  },
  {
    pattern: /\bhover:bg-slate-50\b/g,
    replacement: "hover:bg-accent hover:text-accent-foreground",
  },
  {
    pattern: /\bhover:bg-slate-100\b/g,
    replacement: "hover:bg-accent hover:text-accent-foreground",
  },
  {
    pattern: /\bhover:bg-gray-50\b/g,
    replacement: "hover:bg-accent hover:text-accent-foreground",
  },

  // Borders
  { pattern: /\bborder-neutral-200\b/g, replacement: "border-border" },
  { pattern: /\bborder-neutral-300\b/g, replacement: "border-border" },
  { pattern: /\bborder-slate-200\b/g, replacement: "border-border" },
  { pattern: /\bborder-slate-300\b/g, replacement: "border-border" },
  { pattern: /\bborder-gray-200\b/g, replacement: "border-border" },
  { pattern: /\bborder-gray-300\b/g, replacement: "border-border" },

  // Text colors
  { pattern: /\btext-neutral-900\b/g, replacement: "text-foreground" },
  { pattern: /\btext-neutral-950\b/g, replacement: "text-foreground" },
  { pattern: /\btext-slate-900\b/g, replacement: "text-foreground" },
  { pattern: /\btext-slate-950\b/g, replacement: "text-foreground" },
  { pattern: /\btext-gray-900\b/g, replacement: "text-foreground" },
  { pattern: /\btext-black\b/g, replacement: "text-foreground" },

  { pattern: /\btext-neutral-800\b/g, replacement: "text-foreground" },
  { pattern: /\btext-slate-800\b/g, replacement: "text-foreground" },

  { pattern: /\btext-neutral-700\b/g, replacement: "text-muted-foreground" },
  { pattern: /\btext-slate-700\b/g, replacement: "text-muted-foreground" },
  { pattern: /\btext-gray-700\b/g, replacement: "text-muted-foreground" },

  { pattern: /\btext-neutral-600\b/g, replacement: "text-muted-foreground" },
  { pattern: /\btext-slate-600\b/g, replacement: "text-muted-foreground" },
  { pattern: /\btext-gray-600\b/g, replacement: "text-muted-foreground" },

  { pattern: /\btext-neutral-500\b/g, replacement: "text-muted-foreground" },
  { pattern: /\btext-slate-500\b/g, replacement: "text-muted-foreground" },
  { pattern: /\btext-gray-500\b/g, replacement: "text-muted-foreground" },
];

let changedFiles = 0;

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const originalContent = content;

  for (const { pattern, replacement } of replacements) {
    content = content.replace(pattern, replacement);
  }

  // Clean up duplicate hover:text-accent-foreground if any
  content = content.replace(
    /hover:text-accent-foreground hover:text-accent-foreground/g,
    "hover:text-accent-foreground",
  );

  if (content !== originalContent) {
    writeFileSync(file, content, "utf8");
    changedFiles++;
    console.log(`Updated: ${file}`);
  }
}

console.log(`Total files updated: ${changedFiles}`);
