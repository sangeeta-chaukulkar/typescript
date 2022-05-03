import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// var skey=require('crypto').randomBytes(64).toString('hex');

import bodyParser from 'body-parser';

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');


const app = express();
var cors = require('cors')
app.use(cors())


const adminRoutes = require('./routes/admin');
const purchaseRoutes = require('./routes/purchase');
const resetpasswordRoutes = require('./routes/resetpassword');
app.use('/purchase', purchaseRoutes);
app.use(resetpasswordRoutes);

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'html');
app.use(adminRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

console.log(__dirname);
app.use((req, res)=>{
  res.sendFile(path.join('__dirname/src/public',`${req.url}`));
})

app.use(errorController.get404);


sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
     app.listen(3000);;
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
