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

// AUTH
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ================== DB CONNECT ==================
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

// LOCAL STRATEGY
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return done(null, user);
    else return done(null, false);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// navbar fix
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ================== AUTH ROUTES ==================
app.get("/register", (req, res) => {
  res.render("users/register");
});

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashed
  });

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
  req.logout(() => {
    res.redirect("/login");
  });
});

// ================== MIDDLEWARE ==================
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

// ================== LISTINGS ==================
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index", { allListings });
}));

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  res.render("listings/show", { listing });
}));

app.post("/listings", isLoggedIn, wrapAsync(async (req, res, next) => {
  const result = listingschema.validate(req.body);

  if (result.error) {
    let errMsg = result.error.details.map(el => el.message).join(", ");
    return next(new ExpressError(errMsg, 400));
  }

  const newListing = new Listing(req.body.listing);
  await newListing.save();

  res.redirect("/listings");
}));

app.get("/listings/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
}));

app.put("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
  res.redirect(`/listings/${req.params.id}`);
}));

app.delete("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
}));

// ================== BOOKING ==================
app.post("/book/:id", isLoggedIn, async (req, res) => {
  const { checkIn, checkOut, paymentStatus } = req.body;

  const booking = new Booking({
    user: req.user._id,
    listing: req.params.id,
    checkIn,
    checkOut,
    paymentStatus: paymentStatus || "Pending"
  });

  await booking.save();

  res.redirect("/mybookings");
});

app.get("/mybookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing");

  res.render("bookings/index", { bookings });
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.log(err);

  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error", { message });
});

// ================== EMAIL ==================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pm61522@gmail.com",
    pass: "zjvhnlqgkzqjvav"
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ================== DB + SERVER START (FIXED PART) ==================
async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(" MongoDB connected");

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 8080;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
  console.log(` Server running at http://localhost:${PORT}`);
});
   
  } catch (err) {
    console.log(" Database connection error:", err);
  }
}

startServer();
