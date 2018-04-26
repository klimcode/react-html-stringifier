# React Stringifier

This package is designed for:

1. extremely lightweight single page static websites ("landing pages")
2. based on create-react-app (without eject)

It produces a html-file without a React js-bundle.

## 3 simple steps

1. Install the package: `npm i -D react-html-stringifier` or `yarn add -D react-html-stringifier`
2. Add this line to a `scripts` section of the `package.json`: `"static": "react-scripts build && react-html-stringifier"`
3. Run: `npm run static` or `yarn static`

## Explanation

1. Stringifier will copy the content of your `build` directory to a new one called `static` to work with it.
2. Then it injects a content of `browser-script.js` into your `index.html` file and starts an `express` server.
3. It serves a website and receives its HTML via POST request from `browser-script.js`.
4. (**optional**) Then HTML is received the server removes a React bundle and a `browser-script.js` script from it.

## Settings

In the `package.json` create a property `stringifier`. These are defaults:

```json
"stringifier": {
  "input": "build",
  "output": "docs",
  "host": "localhost",
  "port": 8765,
  "timeout": 300,
  "removeBundle": false
}
```

`timeout` is needed to ensure React is rendered. It's the time after the page loaded and before its HTML is sent to the Stringifier.

## Known Problems (may be fixed later)

1. It does not work on Windows (uses shell commands for copying directories).
