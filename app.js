const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Booking = require("./models/booking");
const Listing = require("./models/listing");
const User = require("./models/user");

const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingschema } = require("./schema");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ================== DB CONNECT ==================
const MONGO_URL = process.env.MONGO_URI;

if (!MONGO_URL) {
  console.log(" MONGO_URI missing in environment variables");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(" MongoDB Connected");
  } catch (err) {
    console.log(" DB Error:", err);
    process.exit(1);
  }
}

connectDB();


// ================= VIEW =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));


// ================= SESSION =================
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));


// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if (!user) return done(null, false);

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? done(null, user) : done(null, false);
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


// ================= GLOBAL =================
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


// ================= ROUTES =================
app.get("/", (req, res) => res.redirect("/listings"));


// AUTH
app.get("/register", (req, res) => res.render("users/register"));
app.get("/login", (req, res) => res.render("users/login"));

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await new User({ username, email, password: hashed }).save();
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


// AUTH MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
}


// ================= LISTINGS =================
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.post("/listings", isLoggedIn, wrapAsync(async (req, res, next) => {
  const result = listingschema.validate(req.body);

  if (result.error) {
    const msg = result.error.details.map(e => e.message).join(",");
    return next(new ExpressError(msg, 400));
  }

  const newListing = new Listing({
    ...req.body.listing,
    owner: req.user._id
  });

  await newListing.save();
  res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing });
}));


// ================= BOOKING =================
app.post("/book/:id", isLoggedIn, async (req, res) => {
  try {

    // 
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

    // EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "pm6152271@gmail.com",
      subject: "🎉 New Booking Received",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Aadhaar:</b> ${data.aadhaar || "N/A"}</p>
        <p><b>PIN:</b> ${data.pincode || "N/A"}</p>
      `
    });

    res.redirect("/mybookings");

  } catch (err) {
    console.log(err);
    res.redirect("/mybookings");
  }
});
  


// ================= BOOKINGS =================
app.get("/mybookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/index", { bookings });
});

app.delete("/bookings/:id", isLoggedIn, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});


// ================= ERROR =================
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render("listings/error", {
    message: err.message || "Something went wrong!"
  });
});


// ================= SERVER =================
app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});


