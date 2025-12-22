const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");

/* ======================================================
   CREATE FOOD (Food Partner)
====================================================== */
async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
      });
    }

    const uploadResult = await storageService.uploadFile(
      req.file.buffer,
      `${uuid()}.mp4`
    );

    const food = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      videoUrl: uploadResult.url,
      foodPartner: req.foodPartner._id,
      likes: 0,
      saves: 0,
    });

    res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.error("Create food error:", error);
    res.status(500).json({
      message: "Failed to create food",
    });
  }
}

/* ======================================================
   GET ALL FOOD (User Feed)
====================================================== */
async function getFoodItems(req, res) {
  try {
    const foods = await foodModel
      .find({})
      .populate("foodPartner", "name");

    res.status(200).json({ foods });
  } catch (error) {
    console.error("Get food items error:", error);
    res.status(500).json({
      message: "Failed to fetch food items",
    });
  }
}

/* ======================================================
   LIKE / UNLIKE FOOD
====================================================== */
async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const existingLike = await likeModel.findOne({
      user: userId,
      food: foodId,
    });

    if (existingLike) {
      await likeModel.deleteOne({ _id: existingLike._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likes: -1 } });

      return res.status(200).json({
        message: "Food unliked successfully",
      });
    }

    await likeModel.create({
      user: userId,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, { $inc: { likes: 1 } });

    res.status(201).json({
      message: "Food liked successfully",
    });
  } catch (error) {
    console.error("Like food error:", error);
    res.status(500).json({
      message: "Failed to like food",
    });
  }
}

/* ======================================================
   SAVE / UNSAVE FOOD
====================================================== */
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const existingSave = await saveModel.findOne({
      user: userId,
      food: foodId,
    });

    if (existingSave) {
      await saveModel.deleteOne({ _id: existingSave._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { saves: -1 } });

      return res.status(200).json({
        message: "Food unsaved successfully",
      });
    }

    await saveModel.create({
      user: userId,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, { $inc: { saves: 1 } });

    res.status(201).json({
      message: "Food saved successfully",
    });
  } catch (error) {
    console.error("Save food error:", error);
    res.status(500).json({
      message: "Failed to save food",
    });
  }
}

/* ======================================================
   GET SAVED FOOD (User)
====================================================== */
async function getSaveFood(req, res) {
  try {
    const userId = req.user._id;

    const saved = await saveModel
      .find({ user: userId })
      .populate({
        path: "food",
        populate: {
          path: "foodPartner",
          select: "name",
        },
      });

    res.status(200).json({
      foods: saved.map(item => item.food),
    });
  } catch (error) {
    console.error("Get saved food error:", error);
    res.status(500).json({
      message: "Failed to fetch saved food",
    });
  }
}

/* ======================================================
   FOOD PARTNER DASHBOARD STATS  ⭐ FIXES YOUR ISSUE ⭐
====================================================== */
async function getFoodPartnerStats(req, res) {
  try {
    const partnerId = req.foodPartner._id;

    const foods = await foodModel.find({ foodPartner: partnerId });

    const totalReels = foods.length;
    const totalLikes = foods.reduce((sum, f) => sum + (f.likes || 0), 0);
    const totalSaves = foods.reduce((sum, f) => sum + (f.saves || 0), 0);

    const avgEngagement =
      totalReels > 0
        ? ((totalLikes + totalSaves) / totalReels).toFixed(1)
        : 0;

    res.status(200).json({
      totalReels,
      totalLikes,
      totalSaves,
      avgEngagement,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      message: "Failed to fetch stats",
    });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
  getFoodPartnerStats, 
};
