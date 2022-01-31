import { expandGlob } from "https://deno.land/std@0.97.0/fs/mod.ts";

export async function findTracks(musicFolder: string, fileEndings: string[]) {
  const globPattern = `${musicFolder}/**/*.{${fileEndings.join()}}`;
  const crates = new Map<string, string[]>();

  for await (const { isFile, path } of expandGlob(globPattern)) {
    if (isFile) {
      const crate = getCrateNameForPath(musicFolder, path);

      if (crates.has(crate)) {
        crates.get(crate)!.push(path);
      } else {
        crates.set(crate, [path]);
      }
    }
  }

  return crates;
}

function getCrateNameForPath(root: string, path: string) {
  const withoutRoot = path.replace(`${root}/`, "");

  if (withoutRoot.includes("/")) {
    return withoutRoot.replace(/\/[^\\/]+$/, "");
  } else {
    return "_";
  }
}
