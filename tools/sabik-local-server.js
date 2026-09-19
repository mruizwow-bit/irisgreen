const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || 8127);
const host = "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function resolveRequest(url) {
  let pathname = decodeURIComponent(String(url || "/").split("?")[0]);
  if (pathname.endsWith("/")) pathname += "index.html";
  const relative = pathname.split("/").filter(Boolean).join(path.sep);
  const file = path.resolve(root, relative);
  if (!file.startsWith(root)) return null;
  return file;
}

http.createServer((request, response) => {
  const file = resolveRequest(request.url);
  if (!file) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, buffer) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(buffer);
  });
}).listen(port, host, () => {
  console.log(`Sabik Iris Green local server: http://${host}:${port}/es/nea/`);
});
