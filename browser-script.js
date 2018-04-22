/* eslint no-console: "off" */
/* eslint-env browser */
module.exports = function send() {
  // strings with %xxx% will be replaced by settings[xxx] during the injection
  const host = "'%host%'";
  const port = '%port%';
  const timeout = '%timeout%';

  setTimeout(() => {
    const content = `<!DOCTYPE html> ${document.getElementsByTagName('html')[0].outerHTML}`;
    fetch(`http://${host}:${port}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: content }),
    })
      .then(r => r.text())
      .then(console.log)
      .catch(() => console.error('can not send a HTML to React-Stringifier', host, port));
  }, timeout);
};
