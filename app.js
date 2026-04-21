// ================== IMPORTS ==================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Booking = require("./models/booking");
const nodemailer = require("nodemailer");

const Listing = require("./models/listing.js");
const User = require("./models/user");

const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema } = require("./schema.js");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ================== ENV FIX (IMPORTANT) ==================
require("dotenv").config();

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// DEBUG (optional)
console.log("EMAIL USER:", process.env.EMAIL_USER);

// ================== DB CONNECT ==================
const MONGO_URL = process.env.MONGO_URI;

if (!MONGO_URL) {
  console.log("❌ MONGO_URI missing");
  process.exit(1);
}

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ DB Error:", err);
    process.exit(1);
  });

// ================== BASIC SETUP ==================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

// ================== SESSION ==================
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));

// ================== PASSPORT ==================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return done(null, user);

    return done(null, false);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ================== GLOBAL USER ==================
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ================== AUTH ==================
app.get("/register", (req, res) => res.render("users/register"));
app.get("/login", (req, res) => res.render("users/login"));

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashed });

  await newUser.save();
  res.redirect("/login");
});

app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/listings",
    failureRedirect: "/login"
  })
);

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

// ================== LOGIN CHECK ==================
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
}

// ================== LISTINGS ==================
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing });
}));

// ================== BOOKING ==================
app.post("/book/:id", isLoggedIn, async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const data = req.body;

    const booking = new Booking({
      user: req.user._id,
      listing: req.params.id,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      name: data.name,
      phone: data.phone,
      aadhaar: data.aadhaar,
      pincode: data.pincode,
      paymentStatus: "Pending"
    });

    await booking.save();

    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.redirect("/mybookings");

    // ================= EMAIL =================
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "pm6152271@gmail.com",
      subject: "🎉 New Booking Received",
      html: `
        <div style="font-family:Arial;padding:20px;background:#f4f6f8">
          <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:10px">
            <h2>New Booking 🚀</h2>
            <p><b>Hotel:</b> ${listing.title}</p>
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Phone:</b> ${data.phone}</p>
            <p><b>Aadhaar:</b> ${data.aadhaar || "N/A"}</p>
            <p><b>PIN:</b> ${data.pincode || "N/A"}</p>
            <p><b>Check-In:</b> ${new Date(data.checkIn).toLocaleString("en-IN")}</p>
            <p><b>Check-Out:</b> ${new Date(data.checkOut).toLocaleString("en-IN")}</p>
          </div>
        </div>
      `
    });

    res.redirect("/mybookings");

  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.redirect("/mybookings");
  }
});

// ================== MY BOOKINGS ==================
app.get("/mybookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/index", { bookings });
});

// ================== DELETE BOOKING ==================
app.delete("/bookings/:id", isLoggedIn, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

// ================== ERROR ==================
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("listings/error", {
    message: "Something went wrong!"
  });
});

// ================== SERVER ==================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
