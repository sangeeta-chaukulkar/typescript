"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize = require('../util/database');
const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: sequelize_1.default.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: sequelize_1.default.BOOLEAN,
    expiresby: sequelize_1.default.DATE
});
module.exports = Forgotpassword;
