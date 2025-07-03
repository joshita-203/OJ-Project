const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { DBConnection } = require("./database/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBConnection();

app.get("/", (req, res) => {
    res.send("Hello WORLD !");
});

// ✅ REGISTER ROUTE (UPDATED)
app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the information");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with the same email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        token: token
      }
    });

  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).send("Something went wrong during registration");
  }
});

// ✅ LOGIN ROUTE (unchanged, works fine)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("Please enter both email and password");
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid email or password");
        }

        const token = jwt.sign(
            { id: user._id, email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        user.token = token;
        user.password = undefined;

        res.status(200).json({
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        console.log("Login error:", error);
        res.status(500).send("Server error");
    }
});

app.post("/logout", (req, res) => {
    res.status(200).json({
        message: "Logout successful. Please delete token from client (like localStorage)."
    });
});

const problemRoutes = require("./routes/problemRoutes");
app.use(problemRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is listening on port ${process.env.PORT}`);
});
