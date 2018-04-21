module.exports = function send() {
  fetch('http://localhost:8765/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: document.getElementsByTagName('html')[0].outerHTML }),
  })
    .then(r => r.text())
    .then(console.log)
    .catch(() => console.error('can not send a HTML to React-Stringifier'));
};
