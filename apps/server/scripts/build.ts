import { build as esbuild } from "esbuild"
import fs from "fs-extra"
import path from "node:path"

const entryPoint = path.resolve(import.meta.dirname, "../src/index.ts")
const dist = path.resolve(import.meta.dirname, "../dist")

export async function build() {
  await esbuild({
    entryPoints: [entryPoint],
    outfile: path.resolve(dist, "index.js"),
    bundle: true,
    platform: "node",
    target: "node24",
  })

  fs.writeFile(path.resolve(dist, "package.json"), JSON.stringify({ main: "index.js" }))
}

if (import.meta.main) {
  await build()
}
