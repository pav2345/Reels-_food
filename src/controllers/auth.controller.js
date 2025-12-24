const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // required for HTTPS (Render / Vercel)
    sameSite: "none",    // required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}



async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    setAuthCookie(res, token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    setAuthCookie(res, token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.status(200).json({ message: "User logged out successfully" });
}



async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;

    const existingPartner = await foodPartnerModel.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({ message: "Food partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName
    });

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);
    setAuthCookie(res, token);

    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: partner._id,
        name: partner.name,
        email: partner.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const partner = await foodPartnerModel.findOne({ email });
    if (!partner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, partner.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);
    setAuthCookie(res, token);

    res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner: {
        _id: partner._id,
        name: partner.name,
        email: partner.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.status(200).json({ message: "Food partner logged out successfully" });
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
};
