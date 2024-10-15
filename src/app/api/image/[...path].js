// pages/api/image/[...path].js
import { join } from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  const { path } = req.query;
  console.log({ path });
  const filePath = join(process.cwd(), "public", ...path);

  try {
    const file = await fs.readFile(filePath);
    res.setHeader("Content-Type", "image/png");
    res.send(file);
  } catch (error) {
    res.status(404).json({ message: "Image not found" });
  }
}
