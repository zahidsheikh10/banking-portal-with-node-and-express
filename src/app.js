const cors = require('cors');
const express = require('express');

// Fs will allow us to read and write files
const fs = require('fs');

//Path will allow us to configure absolute path
const path = require('path');

const app = express();


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}))
app.use(cors());

const port = process.env.PORT || 5000;

//Let us read the data from accounts.json file and store in a constant called accounts data
const accountData = fs.readFileSync(
//read file sync takes two arguments absolute path and encoding
    path.join(__dirname,'json','accounts.json'),'utf-8'
);

//To work with data we have to convert it to a javascript object
const accounts = JSON.parse(accountData);

//Let us read the data from users.json file and store in a constant called users data
const userData = fs.readFileSync(
//read file sync takes two arguments absolute path and encoding
    path.join(__dirname,'json','users.json'),'utf-8'
);

//To work with data we have to convert it to a javascript object
const users = JSON.parse(userData);

app.get('/',(req,res) => {
    res.render('index',{
        title:'Account Summary',
        accounts:accounts
    });
});

app.get('/savings',(req,res) => {
    res.render('account',{
        account:accounts.savings
    });
});

app.get('/checking',(req,res) => {
    res.render('account',{
        account:accounts.checking
    });
});

app.get('/credit',(req,res) => {
    res.render('account',{
        account:accounts.credit
    });
});

app.get('/transfer',(req,res) => {
    res.render('transfer');
});

app.post('/transfer',(req,res) => {
    const fromAccount = req.body.from;
    const toAccount = req.body.to;
    console.log(fromAccount,toAccount);
    accounts[req.body.from].balance = accounts[req.body.from].balance - req.body.amount;
    accounts[req.body.to].balance = parseInt(accounts[req.body.to].balance) + parseInt(req.body.amount);
    const accountsJSON = JSON.stringify(accounts,null ,4);
    fs.writeFileSync(path.join(__dirname,'json/accounts.json'),accountsJSON ,'utf-8');
    res.render('transfer',{message : 'Transfer Completed'});
});

app.get('/payment',(req,res) => {
    res.render('payment',{
        account:accounts.credit
    });
});

app.post('/payment',(req,res) => {
    accounts.credit.balance -= req.body.amount;
    accounts.credit.available += parseInt(req.body.amount,null,10);
    const accountsJSON = JSON.stringify(accounts,null ,4);
    fs.writeFileSync(path.join(__dirname,'json/accounts.json'),accountsJSON ,'utf-8');
    res.render('transfer',
    {
        message : 'Payment Sucessful',
        account : accounts.credit
    });
});


app.get('/profile',(req,res) => {
    res.render('profile',{
        user:users[0]
    });
});
app.listen(port,() => {console.log(`Server is up and running on port :${port}`)});