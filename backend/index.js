import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Poll } from "./models/Poll.js";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";
import { mongoAtlasUri } from "./uri.js";
import jwt from "jsonwebtoken";

//configure cors to accept requests from the frontend server
const corsOptions = {
  //vite servers run on port 5173
  origin : ["http://localhost:5173"],
};

const mongo_uri = mongoAtlasUri;

mongoose
  .connect(mongo_uri)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

const app = express();
app.use(express.json());
//initialize app to use cors
app.use(cors(corsOptions));
const PORT = 8080;

//creaate authentication middleware
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

// get all polls
app.get("/polls", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).send(polls);
  } catch (error) {
    res.status(501).send(error);
  }
});

// get poll by id
app.get("/poll/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(501).send("Invalid id");
      return;
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      res.status(404).send("Not found!");
    }
    res.status(200).send(poll);
  } catch (error) {
    res.status(501).send(error);
  }
});

// create poll
app.post("/poll/create", async (req, res) => {
  const { question, activeDays, options } = req.body;
  //gets deadline 
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + activeDays);
  //create poll obj
  const poll = {
    question,
    deadline: deadlineDate,
    options: options.map((option) => {
      option.vote = 0;
      return option;
    }),
  };
  //add poll obj to db
  try {
    const pollCreated = await Poll(poll);
    await pollCreated.save();
    res.send(pollCreated);
  } catch (error) {
    console.log(error);
    res.status(501).send(error);
  }
});

// update vote count
app.post("/poll/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(501).send("Invalid id");
      return;
    }
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      res.status(404).send("Not found!");
    }

    const { option: optionIndex } = req.body;
    poll.options[optionIndex].vote += 1;

    poll.markModified("options");
    await poll.save();
    res.send(poll);
  } catch (error) {
    //501 means not implemented
    res.status(501).send(error);
  }
});

// create a user
app.post("/user/create", async (req, res) => {
  //retrieve user attributes from req body
  const { username, email, password } = req.body;
  try {
    //check if username and email are duplicate in the db
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail || existingUsername) {
      return res.status(400).json({error: "User already exists"})
    }

    //hash password
    const hash = await bcrypt.hash(password, 12);

    //create user obj with hashed password
    const user = {
      username,
      email,
      password: hash
    }

    const userCreated = await User(user);
    await userCreated.save();

    //do jwt stuff
    //
    //
    //

    //201 means created
    res.status(201).json(user);
   } catch(error) {
    //400 means bad request
    res.status(400).json({error: error.message});
   }
});

//login a user
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //get potential user from only the email
    const potentialUser = await User.findOne({email});
    if (!potentialUser) {
      //401 means unauthorized
      res.status(401).json({error: "Invalid email"});
      return;
    }
    //user exists, so store the hashed password
    const hashedPassword = potentialUser.password;

    //now compare the user inputted password with the stored hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    
    if (!isMatch) {
      //401 means unauthorized
      res.status(401).json({error: "Invalid password"});
      return;
    }
    //everything is fine, so return the user
    res.status(200).json(potentialUser);
  } catch (error) {
    //on an error, return error message
    //500 means internal server error
    res.status(500).json({error : error.message});
  }

});

app.listen(PORT, console.log("port working"));