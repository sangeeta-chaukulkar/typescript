"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize = require('../util/database');
const Expense = sequelize.define('expense', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: sequelize_1.default.BIGINT,
        allowNull: false,
    },
    description: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    category: {
        type: sequelize_1.default.STRING,
        allowNull: false
    }
});
module.exports = Expense;
