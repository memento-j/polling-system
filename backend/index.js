import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { Poll } from "./models/Poll.js";
import { User } from "./models/User.js";
import { mongoAtlasUri, JWT_SECRET } from "./uri.js";


//configure cors to accept requests from the frontend server
const corsOptions = {
  //vite servers run on port 5173
  origin : ["http://localhost:5173"],
  //allows cookies to be sent
  credentials: true,
};

mongoose
  .connect(mongoAtlasUri)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

const app = express();
app.use(express.json());
//initialize app to use cors
app.use(cors(corsOptions));
//enables req.cookies 
app.use(cookieParser());
const PORT = 8080;

//creaate authentication middleware
const isAuthenticated = (req, res, next) => {
  //get jwt from cookie
  const token = req.cookies.token;
  //no token found
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  //verifies using token and secret key
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    //sets req.user to the decoded payload
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

//create private poll (if authenticated) and add to account
app.post("/poll/create-private", isAuthenticated, async (req, res) => {
  const { question, activeDays, options, isPrivate} = req.body;
  //gets deadline 
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + activeDays);

  //get the user id from the token cookie
  const userToken = req.cookies.token;
  let userId = "";
  //verifies using token and secret key, then stores current user id if successful
  jwt.verify(userToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    userId = decoded.id; 
  });

  //create poll obj
  const poll = {
    question,
    deadline: deadlineDate,
    options: options.map((option) => {
      option.vote = 0;
      return option;
    }),
    isPrivate,
    owner: userId
  };

  //add poll obj to db and update user's polls
  try {
    //add poll schema to db
    const pollCreated = await Poll(poll);
    await pollCreated.save();


  
    // add poll obj to user's polls
    await User.updateOne({_id: userId} , { $push : { polls: pollCreated }});
    
    res.send(pollCreated);
  } catch (error) {
    console.log(error);
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
    isPrivate: false,
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

//delete poll (if authenticated and the current authenticated user created it)
app.delete("/poll/delete/:id", isAuthenticated, async (req,res) => {
  try {
    //check if the id of the user is the same as the id of the user that created the poll
    const userToken = req.cookies.token;
    let userId = "";
    //verifies using token and secret key, then stores current user id if successful
    jwt.verify(userToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      userId = decoded.id; 
    });

    //search poll using req param and get the id of the user that created it
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      res.status(404).send("Poll not found!");
    }
    //if current user and poll owner ids are equal, delete the poll
    if (userId === poll.owner) {
      await Poll.deleteOne({ _id: req.params.id });
    } else {
      return res.status(401).json({ error: "Cant delete polls that aren't yours :P" });
    }
    res.status(200).json({message: `${poll.question} poll deleted`});
  //else throw unauthorized to delete poll msg
  } catch(error) {
      res.status(500).json({error : error.message});
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

// update vote count for private polls
app.post("/poll/private/:id", isAuthenticated, async (req, res) => {
  //check request ip in database (get ip from req.ip) 
  //if found, return error saying user cant vote twice
  //if not found, add it to db and continue letting the user vote
  //not sure how it works, so might have to get the ip from the frontend instead?
  
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


// update vote count for public polls
app.post("/poll/:id", async (req, res) => {
  //check request ip in database (get ip from req.ip) 
  //if found, return error saying user cant vote twice
  //if not found, add it to db and continue letting the user vote
  //not sure how it works, so might have to get the ip from the frontend instead?
  
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
      password: hash,
      polls: []
    };

    const userCreated = await User(user);
    await userCreated.save();

    //sign jwt token
    const token = jwt.sign(
      { id: userCreated._id, username: userCreated.username, email: userCreated.email },
      JWT_SECRET
    );
    //create httponly cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS access
      secure: false, // Use HTTPS in production
      sameSite: "Strict", // Prevent CSRF with strict
      maxAge: 3600000, // 1 hour
    });

    //everything is fine, so return ok status with signeed in message
    res.status(200).json({message: "signup success :)"});
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

    //create jwt to be stored in an httponly cookie
    const token = jwt.sign(
      { id: potentialUser._id, username: potentialUser.username, email: potentialUser.email, polls:potentialUser.polls },
      JWT_SECRET
    );
    //create httponly cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS access
      secure: false, // Use HTTPS in production
      sameSite: "Strict", // Prevent CSRF with strict
      maxAge: 3600000, // 1 hour
    });

    //everything is fine, so return ok status with signeed in message
    res.status(200).json({message: "signed in :)"});
    } catch (error) {
      //500 means internal server error
      res.status(500).json({error : error.message});
  }

});

//logout user
app.post("/user/logout", (req, res) => {
  //no one to sign out
  if (req.cookies.token == undefined) {
    res.status(204).json({message: "no one signed in to be logged out"})
  }
  // Clear the httpOnly cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  // Send a success response
  res.status(200).json({message: "Logged out successfully"});
});

//get user information and return it in json format so it can be used on the frontend
app.get("/user", (req, res) => {
  //check if there is a token
  if (!req.cookies.token) {
    return res.status(401).json({message:"no jwt cookie found"})
  }
  //jwt from request
  const token = req.cookies.token;
  
  //verifies using token and secret key
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(200).json(decoded);
  });
});




//vote on private poll (if authenticated)

app.listen(PORT, console.log("port working"));