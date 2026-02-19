import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    let { firstName, lastName, userName, email, password } = req.body;
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exist !" });
    }
    let existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "UserName already exist !" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must contain 8 characters" });
    }
    let hassedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hassedPassword,
    });
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "SignUp error" });
    console.log(error);
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "production",
    });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "login error" });
    console.log(error);
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "logOut error" });
    console.log(error);
  }
};
