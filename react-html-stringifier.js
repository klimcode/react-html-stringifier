const express = require('express');
const CORS = require('cors');
const FILE = require('fs-handy-wraps');
const OPN = require('opn');
const SCRIPT = require('./browser-script').toString();


const inputDir = 'build';
const inputFileName = './build/index.html';
const outputFileName = 'index.html';
let initialHtmlContent;


const log = function logToConsole(message) {
  console.log(message); // eslint-disable-line no-console
};
const postProcess = function processInput(input) {
  const html = `<!DOCTYPE html> + ${input}`;
  FILE.write(
    outputFileName,
    html,
    () => log(`Html placed to file: ${outputFileName}`),
  );
  FILE.write(
    inputFileName,
    initialHtmlContent,
    () => {
      log(`Initial Content returned to ${inputFileName}`);
      // process.exit(0);
    },
  );
};
const startServer = function startExpressServer() {
  const server = express();
  server.use(express.json());
  server.use(CORS({ credentials: true, origin: true }));
  server.post('/', (req, res) => {
    log('POST message received');
    res.send('React Stringifier said: ⊙﹏⊙');
    postProcess(req.body.html);
  });
  server.listen(8765);
};
const openBrowser = function openBrowserUsingServeApp() {
  const server = express();
  server.use('/', express.static(__dirname + '/' + inputDir));
  OPN('http://localhost:8766');
  server.listen(8766, 'localhost');
};
const injectScript = function injectScriptToInputHtml(htmlWithScript) {
  FILE.write(
    inputFileName,
    htmlWithScript,
    () => {
      startServer();
      openBrowser();
    },
  );
};


FILE.read(
  inputFileName,
  (content) => {
    initialHtmlContent = content;
    const scriptInjected = content.replace('</body>', `<script>(${SCRIPT})</script></body>`);
    injectScript(scriptInjected);
  },
);
