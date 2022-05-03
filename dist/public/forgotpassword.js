"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function forgotpassword(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);
    const userEmail = {
        email: form.get("email")
    };
    console.log(userEmail.email);
    axios_1.default.post('http://localhost:3000/forgotpassword', userEmail).then(response => {
        console.log(response);
        if (response.status === 202) {
            document.body.innerHTML += '<div style="color:green;">Mail Successfully sent <div>';
        }
        else {
            throw new Error('Something went wrong!!!');
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    });
}
