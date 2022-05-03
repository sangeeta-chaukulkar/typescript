"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const app = (0, express_1.default)();
var cors = require('cors');
app.use(cors());
const adminRoutes = require('./routes/admin');
const purchaseRoutes = require('./routes/purchase');
const resetpasswordRoutes = require('./routes/resetpassword');
app.use('/purchase', purchaseRoutes);
app.use(resetpasswordRoutes);
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set('view engine', 'html');
app.use(adminRoutes);
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
console.log(__dirname);
app.use((req, res) => {
    res.sendFile(path_1.default.join('__dirname/dist/public', `${req.url}`));
});
app.use(errorController.get404);
sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
    app.listen(3000);
    ;
    console.log(result);
})
    .catch(err => {
    console.log(err);
});
