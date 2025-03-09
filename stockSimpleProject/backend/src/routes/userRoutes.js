const express = require("express");
const router = express.Router();
const { signUpUser, loginUser, updateUsername, updatePassword, logoutUser } = require("../controllers/user");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: http://localhost:3000/users/signup  
router.post("/signup", signUpUser);

// POST: http://localhost:3000/users/login  
router.post("/login", loginUser);

// PUT: http://localhost:3000/users/update-username
router.put("/update-username", authMiddleware, updateUsername);

// PUT: http://localhost:3000/users/update-password
router.put("/update-password", authMiddleware, updatePassword);

// POST: http://localhost:3000/users/logout
router.post("/logout", logoutUser);

// GET: Protected route for authenticated users only
router.get("/protected-route", authMiddleware, (request, response) => {
    response.json({ message: "You have access!", userId: request.user.userId });
});

module.exports = router;