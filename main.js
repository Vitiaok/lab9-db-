// Отримайте посилання на таблицю і її тіло
const dataTable = document.getElementById('dataTable');
const tableBody = dataTable.querySelector('tbody');
const tableCaption = document.getElementById('tableCaption');
const showDataButton = document.getElementById('button1');
const sqlQueryInput = document.getElementById('query');
const executeQueryButton = document.getElementById('button2');
const eraseButton = document.getElementById('button4');
const errorMessage = document.getElementById('errorMessage');
const exportToCsvButton = document.getElementById('button3');






showDataButton.addEventListener('click', () => {
    const selectedColumn = 'Таблиці бази даних:'; // Замініть на назву вибраного стовпця
    tableCaption.textContent = `${selectedColumn}`;
    errorMessage.textContent = '';
    tableBody.innerHTML = '';
    // Очистити поточний вміст таблиці
    fetch('/getdata')
        .then(response => response.json())
        .then(data => {
            data.forEach(rowData => {
                const row = tableBody.insertRow();
                Object.values(rowData).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });
            });
        })
        .catch(error => {
            console.error('Помилка отримання даних:', error);
            document.getElementById('dataContainer').textContent = 'Помилка отримання даних';
        });
});

executeQueryButton.addEventListener('click', () => {
    tableCaption.textContent ='';
    const sqlQuery = sqlQueryInput.value; // Отримати SQL-запит введений користувачем
    const selectedColumn = 'Вивід:';
    tableCaption.textContent = `${selectedColumn}`;
    if(sqlQuery.includes('select'))
    {
        tableCaption.textContent = `${selectedColumn}`;
    } 
    
    // Викликати серверний маршрут для виконання SQL-запиту та отримання результату
    fetch(`/executeQuery?sql=${encodeURIComponent(sqlQuery)}`)
        .then(response => response.json())
        .then(data => {
            // Очистити поточний вміст таблиці
            errorMessage.textContent = '';
            tableBody.innerHTML = '';

            // Пройтися по отриманим даним та додати їх до таблиці
            data.forEach(rowData => {
                const row = tableBody.insertRow();
                Object.values(rowData).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });
            });
        })
        .catch(error => {
            console.error('Помилка виконання SQL-запиту:', error);
            if(sqlQuery.trim()==='')
            {
                errorMessage.textContent = 'Помилка. Ви не ввели запит';
            }else{
                errorMessage.textContent = 'Помилка введення. Введіть ваш запит правильно';
            }
            
        });
});


exportToCsvButton.addEventListener('click', () => {
    const sqlQuery = sqlQueryInput.value;

    // Check if the SQL query input is empty
    if ((sqlQuery.trim()) === '' && (tableBody.innerHTML === '')) {
        errorMessage.textContent = 'Помилка. Ви не ввели запит';
    } else {
        const data = [];
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.textContent);
            });
            data.push(rowData);
        });

        const csvData = convertToCsv(data);

        // Create a link
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
        link.download = 'data.csv';

        // Append the link to the DOM and trigger a click
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM
        document.body.removeChild(link);
    }
});





eraseButton.addEventListener('click', () => {
    tableBody.innerHTML = '';
    tableCaption.textContent ='';
});



