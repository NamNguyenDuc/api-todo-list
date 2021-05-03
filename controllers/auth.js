import jwt from "jsonwebtoken";
import User from "../models/user";

const bcrypt = require('bcryptjs');

export const signup = (req, res) => {
    let {
        name,
        email,
        password,
        password_confirmation
    } = req.body;
    if (password !== password_confirmation) {
        return res.status(200).json({
            msg: "Password do not match."
        });
    }
    if (!email || !password) {
        return res.send('Must include email and password')
    }
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(200).json({
                msg: "Email is already registred. Did you forgot your password."
            });
        }
    });
    // The data is valid and new we can register the user
    let newUser = new User({
        name,
        password,
        email
    });
    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    data: user,
                    msg: "Hurry! User is now registered."
                });
            });
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(200).json({
                user: user,
                msg: "Email is not found.",
                success: false
            });
        }
        // If there is user we are now going to compare the password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
                jwt.sign(payload, 'hastoken', {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        data: {
                            token: token,
                            user: user,
                        },
                        msg: "Hurry! You are now logged in."
                    });
                })
            } else {
                return res.status(200).json({
                    msg: "Incorrect password.",
                    success: false
                });
            }
        })
    });
};

exports.checkLogin = (req, res) => {
    try {
        const { token } = req.headers;
        const ketqua = jwt.verify(token, 'hastoken');
        if (ketqua) {
            User.findById(ketqua._id).exec((error, user) => {
                if (error || !user) {
                    return res.status(200).json({
                        success: false,
                        error: 'User not found'
                    })
                }
                return res.json({
                    success: true,
                    user: user,
                })
            })
        }
    } catch (error) {
        return res.json(403)
    }

};
export const signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: 'Signout Success'
    })
}