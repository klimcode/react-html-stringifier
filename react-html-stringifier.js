#!/usr/bin/env node

const PATH = require('path');
const SHELL = require('child_process').execSync;
const EXPRESS = require('express');
const CORS = require('cors');
const OPN = require('opn');
// Klimcode scripts
const BRIEF = require('brief-async');
const FILE = require('fs-handy-wraps');
const SCRIPT = require('./browser-script').toString();

const appDir = FILE.CWD;
const userSettings = require(PATH.join(appDir, 'package.json')).stringifier;


const defSettings = {
  input: 'build',
  output: 'docs',
  host: 'localhost',
  port: 8765,
  timeout: 300,
};
const settings = Object.assign(defSettings, userSettings);
const outputFileName = 'index.html';
const INPUT_DIR = PATH.resolve(appDir, settings.input);
const OUTPUT_DIR = PATH.resolve(appDir, settings.output);
const outputFilePath = PATH.resolve(OUTPUT_DIR, outputFileName);


const log = function logToConsole(...args) {
  console.log(...args); // eslint-disable-line no-console
};


const copyDir = function copyInputDirContentToOutputDir(args, resolve) {
  const src = args[0];
  const dist = args[1];
  try {
    SHELL(`rm -r -d ${dist}`);
  } catch (e) {
    log(`folder ${dist} has been created`);
  }
  SHELL(`mkdir -p ${dist}`);
  SHELL(`cp -r ${src}/* ${dist}`);
  resolve();
};
const readInputHtml = function readInputHtmlFile(args, resolve) {
  const path = args[1];

  FILE.read(path, resolve);
};
const injectScript = function injectScriptToInputHtml(input, resolve) {
  const scriptFIlled = SCRIPT
    .replace(/'%(.*)%'/g, (_, prop) => settings[prop]);
  const htmlWithScriptInjected = input.replace('</body>', `<script id="stringifier">(${scriptFIlled})()</script></body>`);

  FILE.write(
    outputFilePath,
    htmlWithScriptInjected,
    resolve,
  );
};

const startServer = function startServerAndOpenBrowser(args, resolve) {
  const dir = args[1];
  const server = EXPRESS();
  const { host, port } = settings;

  server.use('/', EXPRESS.static(dir));
  server.use(EXPRESS.json());
  server.use(CORS({ credentials: true, origin: true }));
  server.post('/', (req, res) => {
    if (req.body) {
      res.send('React Stringifier has done its job ⊙﹏⊙');
      resolve(req.body.html);
    }
  });
  server.listen(port, host);

  OPN(`http://${host}:${port}`)
    .then(() => log('browser opened'));
};

const postProcess = function processInput(inputHtml, resolve) {
  log('POST message received');
  let resHtml = inputHtml
    .replace(/<script id="stringifier">[\s\S]*<\/script>/, '');

  if (settings.removeBundle) {
    resHtml = resHtml
      .replace(/<script.*js\/main.*<\/script>/, '')
      .replace(/<script.*\.chunk\.js.*<\/script>/, '');
  }

  FILE.write(
    outputFilePath,
    resHtml,
    () => {
      log(`Html placed to file: ${outputFilePath}`);
      resolve();
      process.exit(0);
    },
  );
};

const roadmap = [
  [INPUT_DIR, OUTPUT_DIR],    copyDir,
  [copyDir, outputFilePath],  readInputHtml,
  [readInputHtml],            injectScript,
  [injectScript, OUTPUT_DIR], startServer,
  [startServer],              postProcess,
];
BRIEF(roadmap);
