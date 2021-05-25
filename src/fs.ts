import { expandGlob } from "https://deno.land/std@0.97.0/fs/mod.ts";

export async function findTracks(musicFolder: string, fileEndings: string[]) {
  const globPattern = `${musicFolder}/**/*.{${fileEndings.join()}}`;
  const crates: Record<string, string[]> = {};

  for await (const { isFile, path } of expandGlob(globPattern)) {
    if (isFile) {
      const crate = getCrateNameForPath(musicFolder, path);

      if (!(crate in crates)) {
        crates[crate] = [];
      }

      crates[crate].push(path);
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
