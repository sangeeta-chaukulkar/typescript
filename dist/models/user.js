"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize = require('../util/database');
const User = sequelize.define('user', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: sequelize_1.default.BIGINT,
        allowNull: false,
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    ispremiumuser: sequelize_1.default.BOOLEAN
});
module.exports = User;
