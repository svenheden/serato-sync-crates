import { emptyDir, exists } from "https://deno.land/std@0.97.0/fs/mod.ts";

import { findTracks } from "./fs.ts";
import { createCrateFile } from "./serato.ts";

const supportedFileEndings = [
  "mp3",
  "ogg",
  "alac",
  "flac",
  "aif",
  "wav",
  "mp4",
  "m4a",
  "aac",
];

try {
  if (Deno.args.length !== 2) {
    throw new Error(
      "You must provide the path to your music folder as the first argument and the path to your Serato folder as the second argument to this program"
    );
  }

  const musicFolder = Deno.args[0].replace(/\/$/, "");
  const seratoFolder = Deno.args[1].replace(/\/$/, "");

  const crates = await findTracks(musicFolder, supportedFileEndings);
  const numberOfCrates = Object.keys(crates).length;
  const numberOfTracks = Object.values(crates).flat().length;

  if (numberOfTracks === 0) {
    throw new Error("Cannot find any tracks in the provided music folder");
  }

  if (await exists(`${seratoFolder}/database V2`)) {
    await Deno.remove(`${seratoFolder}/database V2`);
  }

  await emptyDir(`${seratoFolder}/Subcrates`);

  for (const cratePath in crates) {
    const tracks = crates[cratePath];
    const crateFile = createCrateFile(tracks);
    const fileName = `${cratePath.replace(/\//g, "%%")}.crate`;

    await Deno.writeFile(`${seratoFolder}/Subcrates/${fileName}`, crateFile);
  }

  const duration = performance.now();

  console.log(
    `🎉 Successfully synced ${numberOfCrates} ${
      numberOfCrates === 1 ? "crate" : "crates"
    } with a total of ${numberOfTracks} tracks in ${duration} ms`
  );
} catch (error) {
  console.log("An error occurred while syncing crates:\n", error.message);
}
