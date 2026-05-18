const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jsx')) res.setHeader('Content-Type', 'text/babel; charset=utf-8');
  },
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`BuildCore listening on ${PORT}`));
