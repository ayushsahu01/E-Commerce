const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // ✅ Serve /images etc.

// ---------- SESSION ----------
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// ---------- MAKE SESSION AVAILABLE IN VIEWS ----------
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// ---------- EJS VIEW SETUP ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- ROUTES ----------
app.use('/', authRoutes);
app.use('/', productRoutes);

// ---------- CONNECT TO DB & START SERVER ----------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => app.listen(3000, () => console.log('Server running at http://localhost:3000')))
.catch(err => console.log('MongoDB connection error:', err));
