const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signUpUser = async (request, response) => {
    const { username, password } = request.body;

    try {
        const exists = await User.findOne({ username });
        if (exists) {
            return response.status(400).json({ error: "Username already exists!" });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        // const newUser = await User.create({
        //     username,
        //     password: hashedPassword,
        // });
        const newUser = await User.create({ username, password });

        response.status(201).json({ newUser})
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const loginUser = async (request, response) => {
    const { username, password } = request.body;

    try {
        const exists = await User.findOne({ username });
        if (!exists) {
            return response.status(404).json({ error: "Username not found." });
        }
    
        const isPasswordMatched = await bcrypt.compare(password, exists.password);
        if(!isPasswordMatched) {
            return response.status(400).json({ error: "Incorrect password." })
        }
        
        const token = jwt.sign({ userId: exists._id}, process.env.JWT_SECRET, { expiresIn: "1h" });

        response.status(200).json({ username, token })
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

const updateUsername = async (request, response) => {
    const { userId } = request.user;
    const { newUsername } = request.body;

    try {
        const exists = await User.findOne({ username: newUsername });
        if (exists) {
            return response.status(400).json({ error: "Username already taken!" });
        }

        await User.findByIdAndUpdate(userId, { username: newUsername });

        response.status(200).json({ message: "Username updated successfully." });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const updatePassword = async (request, response) => {
    const { userId } = request.user;
    const { oldPassword, newPassword } = request.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ error: "User not found." });
        }

        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatched) {
            return response.status(400).json({ error: "Old password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        response.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const logoutUser = async (request, response) => {
    response.status(200).json({ message: "Logged out successfully" });
};


module.exports = {
    signUpUser,
    loginUser,
    updateUsername,
    updatePassword,
    logoutUser
}