const PATH = require('path');
const SHELL = require('child_process').execSync;
const EXPRESS = require('express');
const CORS = require('cors');
const FILE = require('fs-handy-wraps');
const OPN = require('opn');
const SCRIPT = require('./browser-script').toString();
const BRIEF = require('brief-async');


const inputDirName = 'build';
const outputDirName = 'static';
const outputFileName = 'index.html';
const inputDir = PATH.resolve(__dirname, inputDirName);
const outputDir = PATH.resolve(__dirname, outputDirName);
const outputFilePath = PATH.resolve(outputDir, outputFileName);
const host = 'localhost';
const port = 8000;


const log = function logToConsole(message) {
  console.log(message); // eslint-disable-line no-console
};


const copyDir = function copyInputDirContentToOutputDir(args, resolve) {
  const src = args[0];
  const dist = args[1];
  SHELL(`rm -r ${dist}`);
  SHELL(`mkdir -p ${dist}`);
  SHELL(`cp -r ${src}/* ${dist}`);
  resolve();
};
const readInputHtml = function readInputHtmlFile(args, resolve) {
  const path = args[1];

  FILE.read(path, resolve);
};
const injectScript = function injectScriptToInputHtml(input, resolve) {
  const htmlWithScriptInjected = input.replace('</body>', `<script id="stringifier">var G = ${SCRIPT}; G()</script></body>`);

  FILE.write(
    outputFilePath,
    htmlWithScriptInjected,
    resolve,
  );
};

const startServer = function startRecipientServer(_, resolve) {
  const server = EXPRESS();
  server.use(EXPRESS.json());
  server.use(CORS({ credentials: true, origin: true }));
  server.post('/', (req, res) => {
    log('POST message received');
    res.send('React Stringifier said: ⊙﹏⊙');
    resolve(req.body.html);
  });
  server.listen(port);
};
const openBrowser = function openBrowserForRendering(args, resolve) {
  const dir = args[1];
  const renderingHost = host;
  const renderingPort = port + 1;
  const server = EXPRESS();
  server.use('/', EXPRESS.static(dir));
  server.listen(renderingPort, renderingHost);
  OPN(`http://${renderingHost}:${renderingPort}`)
    .then(() => log('browser opened'))
    .then(resolve);
};

const postProcess = function processInput(inputHtml, resolve) {
  const resHtml = inputHtml
    .replace(/<script.*js\/main.*<\/script>/, '')
    .replace(/<script id="stringifier">[\s\S]*<\/script>/, '');

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
  [inputDir, outputDir],      copyDir,
  [copyDir, outputFilePath],  readInputHtml,
  [readInputHtml],            injectScript,
  [injectScript, outputDir],  startServer, openBrowser,
  [startServer],              postProcess,
];
BRIEF(roadmap);
