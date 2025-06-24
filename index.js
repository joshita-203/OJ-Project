const express = require("express");
const app = express();
const cors = require("cors");
const { DBConnection } = require("./database/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(cors());

DBConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req, res) => {
    res.send("Hello WORLD !");
});

app.post("/register", async (req,res) => {
   try {
     //get all the data from the frontend
    const{firstname,lastname,email,password}= req.body;
    //check that all the data should exists
    if(!(firstname&&lastname&&email&&password)){
        return res.status(400).send("Please enter all the information");
    }

    //add more validations

    //check if the user already exists

    const existingUser= await User.findOne({email});
    if(existingUser)
    {
        return res.status(400).send("User already exists with the same email");
    }

    //hashing/encrypt the password

    const hashedPassword = await bcrypt.hash(password, 10);

    //save the user in the db

    const user = await User.create(
        {
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });


    //generate a token for user and send it 

    const token=jwt.sign({id: user._id,email},process.env.SECRET_KEY,{
        expiresIn: '1h',
    });
    user.token= token;
    user.password = undefined;
    res.status(200).json({message: 'You have successfully registered!',user});

   } catch (error) {
    console.log(error);
   }
});

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


app.listen(process.env.PORT,() => {
    console.log(`Server is listening on port ${process.env.PORT}!`);
});