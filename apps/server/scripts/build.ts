import { build as esbuild } from "esbuild"
import fs from "fs-extra"
import { spawnSync } from "node:child_process"
import path from "node:path"

const entryPoint = path.resolve(import.meta.dirname, "../src/index.ts")
const dist = path.resolve(import.meta.dirname, "../dist")
const pnpmDeployTarget = path.resolve(dist, ".pnpm-deploy")

export async function build() {
  fs.removeSync(dist)

  await esbuild({
    entryPoints: [entryPoint],
    outfile: path.resolve(dist, "index.js"),
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node24",
    packages: "external",
  })

  spawnSync("pnpm", ["deploy", "--filter", "@repo/server", "--prod", pnpmDeployTarget], {
    stdio: "inherit",
  })

  fs.copySync(path.resolve(pnpmDeployTarget, "node_modules"), path.resolve(dist, "node_modules"))
  fs.removeSync(pnpmDeployTarget)
  fs.writeFileSync(path.resolve(dist, "package.json"), JSON.stringify({ type: "module" }, null, 2))
}

if (import.meta.main) {
  await build()
}
