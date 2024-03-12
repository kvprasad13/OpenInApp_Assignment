const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
exports.registerUser = async (req, res) => {

    const { phone_number, priority, password, confirmPassword } = req.body;
    console.log("all are - ", phone_number, priority, password, confirmPassword);

    // if ( !phone_number || !priority || !password || !confirmPassword) {
    //     throw new Error("All fields are required");
    // }
    if (!phone_number || !priority || !password || !confirmPassword) {
        throw new Error("All fields are required");
    }
    else if (!/^\d{10}$/.test(phone_number) || !/^\d{1}$/.test(priority)) {
        throw new Error("Phone number should be 10 digits and all should be numbers and priority should be single digit");

    }
    else if (Number(priority) < 0 || Number(priority) > 2) {
        throw new Error("Priority must be between 0 and 2 inclusive");


    }
    else {
        if (password !== confirmPassword) {
            res.status(400).send("Passwords do not match");
        }
        else {
            const user = await User.findOne({ phone_number });
            if (user) {
                res.status(200).send("User already exists");

            }
            else {

                const hashedPassword = await bcrypt.hash(password, 10);
                try {
                    const newUser = await User.create({ phone_number:Number(phone_number), password: hashedPassword, priority:Number(priority) });
                    res.status(201).json(newUser);
                }
                catch (err) {
                    console.log(err);
                    res.status(400).send("error creating user");

                }

            }
        }
    }
}
exports.loginUser = async (req, res) => {

    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        throw new Error("All fields are required");
    }
    else {
        const user = await User.findOne({ phone_number });
        if (!user) {
            res.status(404).send("User not found");

        }
        else {

            const validUser = await bcrypt.compare(password, user.password);
            if (validUser) {

                const accessToken = jwt.sign({ id: user._id, phone_number, priority: user.priority }, process.env.ACCESS_TOKEN_SECRET);
                res.status(200).json({ "message": "Logged in successfully", "accessToken": accessToken });
            }
            else {
                res.status(400).send("Invalid password");
            }
        }

    }



}
exports.getCurrentUser = (req, res) => {
    res.status(200).send(req.user);

}