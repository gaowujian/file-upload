import path from "path";
import fs from "fs-extra";
export const TEMP_DIR = path.resolve(__dirname, "temp");
export const PUBLIC_DIR = path.resolve(__dirname, "public");

export const splitChunks = async function (
  filename: string,
  chunkSize: number = 10 * 1024
) {
  const filePath = path.resolve(PUBLIC_DIR, filename);
  const tempDir = path.resolve(TEMP_DIR, filename);
  await fs.mkdir(tempDir);
  const data: Buffer = await fs.readFile(filePath);
  let i = 0,
    current = 0,
    length = data.length;
  while (current < length) {
    await fs.writeFile(
      path.resolve(tempDir, filename + "-" + i),
      data.slice(current, current + chunkSize)
    );
    i++;
    current += chunkSize;
  }
  //   data.slice(0, chunkSize);
  //   console.log(data);
  //   console.log(chunkSize);
};

splitChunks("1.png", 0.21 * 10 ** 6);
