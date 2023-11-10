const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // Отримайте дані з бази даних та передайте їх до шаблону
  connection.query('SHOW tables', (err, results) => {
    if (err) {
      console.error('Помилка запиту до бази даних:', err);
      return res.status(500).send('Помилка сервера');
    }
    res.render('шаблон', { data: results });
  });
});

app.listen(3000, () => {
  console.log('Сервер запущено на порту 3000');
});
