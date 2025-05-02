import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import bootstrap from './main.server.js'; // Adjust this if needed

export function app() {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url)); // dist/fastkart-frontend/server
  const browserDistFolder = resolve(serverDistFolder, '../browser'); // dist/fastkart-frontend/browser
  const indexHtml = join(browserDistFolder, 'index.html'); // SSR uses this as the document

  const commonEngine = new CommonEngine();

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }));

  // Handle all routes with SSR
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run() {
  const port = process.env['PORT'] || 4200;
  const server = app();
  server.listen(port, () => {
    console.log(`✅ SSR server running at http://localhost:${port}`);
  });
}

run();

