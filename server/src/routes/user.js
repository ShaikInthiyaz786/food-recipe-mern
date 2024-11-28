// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// const router = express.Router();
// import { UserModel } from "../models/Users.js";

// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await UserModel.findOne({ username });
//   if (user) {
//     return res.status(400).json({ message: "Username already exists" });
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = new UserModel({ username, password: hashedPassword });
//   await newUser.save();
//   res.json({ message: "User registered successfully" });
// });

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   const user = await UserModel.findOne({ username });

//   if (!user) {
//     return res
//       .status(400)
//       .json({ message: "Username or password is incorrect" });
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res
//       .status(400)
//       .json({ message: "Username or password is incorrect" });
//   }
//   const token = jwt.sign({ id: user._id }, "secret");
//   res.json({ token, userID: user._id });
// });

// export { router as userRouter };

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     jwt.verify(authHeader, "secret", (err) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../models/Users.js";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id });
});

export { router as userRouter };

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     jwt.verify(authHeader, "secret", (err) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Split "Bearer <TOKEN>" and extract the token
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden: Invalid or expired token
      }
      console.log(`this is user ${user.id}`);
      req.user = user; // Optionally attach the user info to the request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized: No token provided
  }
};
