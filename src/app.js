const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();


const allowedOrigins = [
  "http://localhost:5174",
];

/* CORS */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error("CORS not allowed from this origin: " + origin)
        );
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("FoodReels API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
