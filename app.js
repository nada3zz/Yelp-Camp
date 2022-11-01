const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require('./routes/camgrounds');
const reviews = require('./routes/reviews');
const app = express();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
}

const db = mongoose.connection;
db.once('open', () => console.log('DB connected'));

// middleware to parse req body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "static")));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
};
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/', (req, res) => res.render('home') );
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);


app.all('*', (req, res, next) => {
  next( new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render('error', { err });
});
app.listen(3030, () => console.log("serving on port 3030"));