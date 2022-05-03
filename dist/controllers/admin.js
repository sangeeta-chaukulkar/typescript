"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User = require('../models/user');
const Expense = require('../models/expense');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const localStorage_1 = __importDefault(require("localStorage"));
const uuid_1 = __importDefault(require("uuid"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const Forgotpassword = require('../models/forgotpassword');
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const sequelize_1 = __importDefault(require("sequelize"));
exports.deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({ where: { id: expenseid } }).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly" });
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed" });
    });
};
exports.downloadExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ success: false, message: 'User is not a premium User' });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
    }
});
exports.forgotpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log("email", email);
        const user = yield User.findOne({ where: { email } });
        if (user) {
            const id = uuid_1.default.v4();
            user.createForgotpassword({ id, active: true })
                .catch(err => {
                throw new Error(err);
            });
            mail_1.default.setApiKey(process.env.SENGRID_API_KEY);
            const msg = {
                to: email,
                from: 'uttamchaukulkar@gmail.com',
                subject: 'SendGrid email',
                text: 'SendGrid with Node.js',
                html: `<p>Hi</p>`,
            };
            mail_1.default
                .send(msg)
                .then((response) => {
                return res.status(response[0].statusCode).json({ message: 'Hello there!', sucess: true });
            })
                .catch((error) => {
                throw new Error(error);
            });
        }
        else {
            throw new Error('User doesnt exist');
        }
    }
    catch (err) {
        console.error(err);
        return res.json({ message: err, sucess: false });
    }
});
exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
        .then(user => {
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        bcrypt_1.default.compare(password, user.password)
            .then(isMatch => {
            if (isMatch) {
                jsonwebtoken_1.default.sign({ id: user.dataValues.id }, process.env.TOKEN_SECRET, { expiresIn: '1800s' }, (err, token) => {
                    localStorage_1.default.setItem('token', JSON.stringify({ token: token }));
                    if (user.dataValues.ispremiumuser) {
                        res.send({ token: token, message: 'Premium User' });
                    }
                    res.send({ token: token, message: 'Login successfully' });
                });
            }
            else {
                return res.status(401).json({ message: "User Not Authorized" });
            }
        });
    })
        .catch(err => {
        console.log(err);
    });
};
exports.postUser = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
        .then(present => {
        if (present) {
            res.json({ message: 'User already exists, Please Login' });
        }
        bcrypt_1.default.hash(password, 12)
            .then(hashpassword => {
            User
                .create({
                name: name,
                email: email,
                phone: phone,
                password: hashpassword
            });
        })
            .then(result => {
            res.json({ message: 'Successfuly signed up' });
        });
    })
        .catch(err => {
        console.log(err);
    });
};
const authenticate = (req, res, next) => {
    try {
        const token = req.headers('authorization');
        const userid = Number(jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET).id);
        User.findByPk(userid).then(user => {
            req.user = user;
            next();
        }).catch(err => { throw new Error(err); });
    }
    catch (err) {
        return res.status(401).json({ success: false });
    }
};
exports.postExpense = (req, res) => {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    req.user.createExpense({
        amount: amount,
        description: description,
        category: category
    })
        .then(expense => {
        return res.status(201).json({ expense, message: 'Expenses added successfuly' });
    })
        .catch(err => {
        return res.status(402).json({ message: err });
    });
};
exports.getexpenses = (req, res) => {
    req.user.getExpenses().then(expenses => {
        return res.status(200).json({ expenses, success: true });
    })
        .catch(err => {
        return res.status(402).json({ error: err, success: false });
    });
};
exports.getDailyexpenses = (req, res) => {
    const Op = sequelize_1.default.Op;
    // const TODAY_START = new Date().setHours(0, 0, 0, 0);
    // const NOW = new Date();
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
    req.user.getExpenses({ where: { createdAt: {
                // [Op.gt]: TODAY_START,
                // [Op.lt]: NOW
                [Op.gt]: threshold
            } } })
        .then(expenses => {
        return res.status(200).json({ expenses, success: true });
    })
        .catch(err => {
        return res.status(402).json({ error: err, success: false });
    });
};
exports.getWeeklyexpenses = (req, res) => {
    const Op = sequelize_1.default.Op;
    const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    console.log(threshold);
    req.user.getExpenses({ where: { createdAt: {
                [Op.gt]: threshold
            } } })
        .then(expenses => {
        return res.status(200).json({ expenses, success: true });
    })
        .catch(err => {
        return res.status(402).json({ error: err, success: false });
    });
};
exports.getMonthlyexpenses = (req, res) => {
    const Op = sequelize_1.default.Op;
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    console.log(threshold);
    req.user.getExpenses({ where: { createdAt: {
                [Op.gt]: threshold
            } } })
        .then(expenses => {
        return res.status(200).json({ expenses, success: true });
    })
        .catch(err => {
        return res.status(402).json({ error: err, success: false });
    });
};
exports.getUserExpenses = (req, res, next) => {
    Expense.findAll({ where: { userId: req.params.userid } })
        .then(expenses => {
        if (!expenses) {
            return res.status(404).json({ message: "Not Found" });
        }
        res.json({ expenses });
    });
};
exports.getUsers = (req, res, next) => {
    User.findAll()
        .then(users => {
        res.json({ users });
    });
};
function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    let s3bucket = new aws_sdk_1.default.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    });
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err);
            }
            else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        });
    });
}
exports.downloadexpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield req.user.getExpenses();
        console.log(expenses);
        const stringnifiedExpenses = JSON.stringify(expenses);
        const userid = req.user.id;
        const filename = `Expense${userid}/${new Date()}.txt`;
        const fileUrl = yield uploadToS3(stringnifiedExpenses, filename);
        res.status(201).json({ fileUrl, success: true });
    }
    catch (err) {
        res.status(500).json({ fileUrl: '', success: false, err: err });
    }
});
exports.getExpense = (req, res, next) => {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = parseInt(req.params.items_per_page);
    let totalItems;
    req.user.getExpenses()
        // Expense.count({ where: { userId : req.user} })
        .then(numExpense => {
        numExpense = JSON.parse(JSON.stringify(numExpense));
        totalItems = Object.keys(numExpense).length;
        console.log("totalItems", totalItems);
        console.log(Math.ceil(totalItems / ITEMS_PER_PAGE));
        console.log(ITEMS_PER_PAGE, req.user.id, page);
        return Expense.findAll({ where: { userId: req.user.id }, offset: ((page - 1) * ITEMS_PER_PAGE), limit: ITEMS_PER_PAGE });
        // return req.user.getExpenses({offset: ((page - 1) * ITEMS_PER_PAGE) , limit: ITEMS_PER_PAGE} );
    })
        .then(expenses => {
        // console.log(count);
        res.json({
            currentPage: page,
            prods: expenses,
            totalexpenses: totalItems,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
        .catch(err => {
        const error = new Error(err);
        // error.httpStatusCode = 500;
        return next(error);
    });
};
exports.getUserExpense = (req, res, next) => {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = parseInt(req.params.items_per_page);
    const userid = parseInt(req.params.userid);
    let totalItems;
    Expense.findAll({ where: { userId: userid } })
        // Expense.count({ where: { userId : req.user} })
        .then(numExpense => {
        numExpense = JSON.parse(JSON.stringify(numExpense));
        totalItems = Object.keys(numExpense).length;
        console.log("totalItems", totalItems);
        console.log(Math.ceil(totalItems / ITEMS_PER_PAGE));
        console.log(ITEMS_PER_PAGE, userid, page);
        return Expense.findAll({ where: { userId: userid }, offset: ((page - 1) * ITEMS_PER_PAGE), limit: ITEMS_PER_PAGE });
        // return req.user.getExpenses({offset: ((page - 1) * ITEMS_PER_PAGE) , limit: ITEMS_PER_PAGE} );
    })
        .then(expenses => {
        // console.log(count);
        res.json({
            currentPage: page,
            prods: expenses,
            totalexpenses: totalItems,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
        .catch(err => {
        const error = new Error(err);
        // error.httpStatusCode = 500;
        return next(error);
    });
};
