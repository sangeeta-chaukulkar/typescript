"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchaseController = require('../controllers/purchase');
const authenticatemiddleware = require('../middleware/auth');
const router = express_1.default.Router();
router.get('/premiummembership', authenticatemiddleware.authenticate, purchaseController.purchasepremium);
router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus);
module.exports = router;
