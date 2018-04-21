# React Stringifier

This package is designed for:

1. single page static websites ("landing pages")
2. extremely light weight websites
3. based on create-react-app (without eject)

It produces a html-file without a React bundle. It's possible to add custom vanilla-JS scripts there.

## 3 simple steps

1. Add this code to `index.html` within the `body` tag:

```js
fetch('http://localhost:8765/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ html: document.getElementsByTagName('html')[0].outerHTML }),
})
  .then(r => r.text())
  .then(console.log)
  .catch(() => console.error('can not send a HTML to React-Stringifier'));
```
