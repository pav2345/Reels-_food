const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5174",
  "https://694b98ac91fdb80d947bc7e1--glittering-baklava-71eae1.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin: " + origin));
    }
  },
  credentials: true
}));

// Enable preflight requests for cookies
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("FoodReels API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
