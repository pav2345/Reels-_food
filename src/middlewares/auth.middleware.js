const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");


async function authUserMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);


    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    // 🔒 CRITICAL CHECK
    if (!foodPartner) {
      return res.status(401).json({
        message: "Food partner not found",
      });
    }

    // Attach food partner to request
    req.foodPartner = foodPartner;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authUserMiddleware,
  authFoodPartnerMiddleware,
};
