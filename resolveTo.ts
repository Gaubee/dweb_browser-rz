import fs from "node:fs";
import node_path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const createBaseResolveTo = (baseDir: string = process.cwd()) => {
  if (baseDir.startsWith("file://")) {
    baseDir = fileURLToPath(baseDir);
    try {
      if (fs.statSync(baseDir).isFile()) {
        baseDir = node_path.dirname(baseDir);
      }
      // deno-lint-ignore no-empty
    } catch { }
  }
  const baseResolveTo = (...paths: (string | URL)[]) => {
    let purePaths = paths.map((it) => it.toString());
    const filePathIndex = purePaths.findLastIndex((it) => it.startsWith("file:"));
    if (filePathIndex !== -1) {
      purePaths = purePaths.slice(filePathIndex);
      return node_path.resolve(fileURLToPath(purePaths[0]), ...purePaths.slice(1));
    }
    return node_path.resolve(baseDir, ...purePaths);
  };
  return baseResolveTo;
};

export const createRootResolver = (base_url?: string) => {
  let rootDirname = process.cwd();
  if (typeof base_url === "string") {
    if (base_url?.startsWith("file:")) {
      rootDirname = fileURLToPath(base_url);
    } else {
      rootDirname = node_path.resolve(rootDirname, base_url);
    }
  }
  while (
    false === fs.existsSync(node_path.resolve(rootDirname, "package.json"))
  ) {
    rootDirname = node_path.resolve(rootDirname, "..");
  }
  const rootResolver = (...paths: string[]): string =>
    node_path.resolve(rootDirname, ...paths);
  return { rootDirname, rootResolver };
};