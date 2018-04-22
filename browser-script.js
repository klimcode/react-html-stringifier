/* eslint no-console: "off" */
/* eslint-env browser */
module.exports = function send() {
  const port = 8000;
  setTimeout(() => {
    const content = `<!DOCTYPE html> ${document.getElementsByTagName('html')[0].outerHTML}`;
    fetch(`http://localhost:${port}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: content }),
    })
      .then(r => r.text())
      .then(console.log)
      .catch(() => console.error('can not send a HTML to React-Stringifier', port));
  }, 100);
};
