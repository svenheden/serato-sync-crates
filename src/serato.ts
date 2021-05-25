import { UtfString } from "https://deno.land/x/utfstring/mod.ts";
import { Buffer } from "https://deno.land/std@0.76.0/node/buffer.ts";

const utf16 = (str: string) => new Uint8Array(UtfString.stringToBytes(str));

const int32 = (num: number) => {
  const buffer = new Buffer(4);
  buffer.writeInt32BE(num);
  return buffer;
};

const encoder = new TextEncoder();

const versionHeader = Buffer.concat([
  encoder.encode("vrsn"),
  new Uint8Array([0, 0]),
  utf16("81.0"),
  utf16("/Serato ScratchLive Crate"),
]);

export function createCrateFile(files: string[]) {
  const tracks = files.map((file) => {
    file = file.replace(/^\//, "");

    return Buffer.concat([
      encoder.encode("otrk"),
      int32(file.length * 2 + 8),
      encoder.encode("ptrk"),
      int32(file.length * 2),
      utf16(file),
    ]);
  });

  return Buffer.concat([versionHeader, ...tracks]);
}
