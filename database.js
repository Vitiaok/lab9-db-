const mysql = require('mysql2'); // Use mysql2 with Promises
const prompt = require("prompt-sync")({ sigint: true });
const express = require("express");
const bodyParser= require('body-parser');
const dotenv = require("dotenv");
dotenv.config()

const connection =  mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
});





function convertToCsv(data) {
    const csvHeaders = Object.keys(data[0]).join(',') + '\n';
    const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
    return csvHeaders + csvRows;
}



connection.connect((err) => {
    if(err){
        console.log(err.message);
    }
    else{
        console.log("Connection`s reached");
        
    }
    

});


const app = express();
const path = require('path');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/csv;charset=utf-8');
    res.sendFile(path.join(__dirname, '', 'index.html'));
});


// Маршрут для отримання даних з бази даних
app.get('/getdata', (req, res) => {
    // Отримати дані з бази даних та відправити їх у відповіді
    // Тут ви повинні використовувати ваш код для взаємодії з базою даних
    // Приклад:
    connection.query('show tables', (err, results) => {
        if (err) {
             console.error('Помилка запиту до бази даних:', err);
             return res.status(500).json({ error: 'Помилка сервера' });
        }
        res.json(results);
     });
});

app.get('/executeQuery', (req, res) => {
    const sqlQuery = req.query.sql; // Отримати SQL-запит з параметру запиту

    // Виконати SQL-запит до бази даних
    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Помилка виконання SQL-запиту:', err);
            return res.status(500).json({ error: 'Помилка сервера' });
        }
        res.json(results);
    });
});

app.get('/exportToCsv', (req, res) => {
    const sqlQuery = req.query.sql; // Get the SQL query from the request query parameters

    // Execute the SQL query and retrieve the data from the database
    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Error executing SQL query' });
        }

        // Convert the data to CSV format
        const csvData = convertToCsv(results);

        // Set the response headers to trigger a download
        res.setHeader('Content-Type', 'text/csv;charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="data.csv"`);

        // Send the CSV data as the response
        res.send(csvData);
    });
});


app.listen(process.env.PORT, () => {
    console.log('Сервер запущено на порту 3000');
});

   
        


    
        
   
         
  





    
  
