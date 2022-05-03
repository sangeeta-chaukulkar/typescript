const bcrypt = require('bcrypt');
const user = require('../models/user');
const forgtpassword = require('../models/forgotpassword');
const resetpassword = (req, res) => {
    const id = req.params.id;
    forgtpassword.findOne({ where: { id: id } }).then(forgotpasswordrequest => {
        console.log(forgotpasswordrequest);
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('hi')
                                        }
                                    </script>
                                    <form action="/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
            res.end();
        }
    });
};
const updatepassword = (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        forgtpassword.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
            user.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
                if (user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfuly update the new password' });
                            });
                        });
                    });
                }
                else {
                    return res.status(404).json({ error: 'No user Exists', success: false });
                }
            });
        });
    }
    catch (error) {
        return res.status(403).json({ error, success: false });
    }
};
module.exports = {
    updatepassword,
    resetpassword
};
