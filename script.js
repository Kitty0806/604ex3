const sqlite3 = require('sqlite3').verbose();  
const readline = require('readline');  
const rl = readline.createInterface({  
    input: process.stdin,  
    output: process.stdout  
});  
  
// 创建或连接到SQLite数据库  
let db = new sqlite3.Database('./books.db', (err) => {  
    if (err) {  
        return console.error(err.message);  
    }  
    console.log('Connected to the SQLite database.');  
  
    // 创建表格（如果尚未存在）  
    db.run('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, isbn TEXT)', (err) => {  
        if (err) {  
            return console.error(err.message);  
        }  
        console.log('Books table created successfully.');  
  
        // 开始接收用户输入  
        promptUserForBookInfo();  
    });  
});  
  
// 提示用户输入图书信息并插入到数据库中  
function promptUserForBookInfo() {  
    rl.question('Enter book title: ', (title) => {  
        rl.question('Enter book author: ', (author) => {  
            rl.question('Enter book ISBN: ', (isbn) => {  
                const sql = 'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)';  
                db.run(sql, [title, author, isbn], (err) => {  
                    if (err) {  
                        return console.error(err.message);  
                    }  
                    console.log(`Book added: ${title} by ${author}`);  
  
                    // 询问用户是否继续添加  
                    rl.question('Do you want to add another book? (yes/no): ', (answer) => {  
                        if (answer.toLowerCase() === 'yes') {  
                            promptUserForBookInfo(); // 递归调用继续添加  
                        } else {  
                            // 用户选择不再添加，关闭readline接口并列出所有书籍  
                            rl.close();  
                            listBooks();  
                        }  
                    });  
                });  
            });  
        });  
    });  
}  
  
// 列出数据库中所有书籍  
function listBooks() {  
    db.all('SELECT * FROM books', [], (err, rows) => {  
        if (err) {  
            return console.error(err.message);  
        }  
        console.log('All books:');  
        rows.forEach((row) => {  
            console.log(`ID: ${row.id}, Title: ${row.title}, Author: ${row.author}, ISBN: ${row.isbn}`);  
        });  
    });  
}  
  
// 当脚本执行完毕时调用  
process.on('exit', (code) => {  
    if (code === 0) {  
        console.log('\nThank you for using the book adding tool!');  
    }  
});