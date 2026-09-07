import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("dist/server");
fs.mkdirSync(outDir, { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const url = new URL(request.url);
    url.pathname = "/";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`;

fs.writeFileSync(path.join(outDir, "index.js"), worker, "utf8");
