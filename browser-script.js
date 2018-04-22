/* eslint no-console: "off" */
/* eslint-env browser */
module.exports = function send() {
  const content = `<!DOCTYPE html> ${document.getElementsByTagName('html')[0].outerHTML}`;
  fetch('http://localhost:8765/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: content }),
  })
    .then(r => r.text())
    .then(console.log)
    .catch(() => console.error('can not send a HTML to React-Stringifier'));
};
