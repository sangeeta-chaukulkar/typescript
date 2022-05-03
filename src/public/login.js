"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var forgotpassbtn = document.getElementById('forgotpass-btn');
forgotpassbtn.addEventListener('click', function () {
    window.location.replace('forgotpassword.html');
});
var loginbtn = document.getElementById('login-btn');
loginbtn.addEventListener('click', userLogin);
function userLogin(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    ValidateEmail(email);
    axios_1["default"].post("http://localhost:3000/login", { email: email, password: password })
        .then(function (result) {
        localStorage.setItem('token', result.data.token);
        if (result) {
            if (result.data.message === 'Premium User') {
                window.location.replace('../expensePremium.html');
            }
            else {
                window.location.replace('../expense.html');
            }
        }
        else {
            throw new Error('Failed to login');
        }
    })["catch"](function (err) {
        console.log(err);
    });
}
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // let input=inputText.value;
    if (inputText.match(mailformat)) {
        return true;
    }
    else {
        alert("You have entered an invalid email address!");
        inputText.focus();
        return false;
    }
}
