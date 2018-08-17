var express = require("express"),
    app = express(),
    request = require("request"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment   = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


seedDB();

// mongoose.connect("mongodb://localhost:27017/yelp_camp2", {useNewUrlParser: true });
mongoose.connect("mongodb://williamrhp:MdM010MdM@ds123532.mlab.com:23532/yelpcampwrhp", {useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport configuration//
app.use(require("express-session")({
    secret: "first car",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT,process.env.IP,console.log("connected"));

// Campground.create(
//     {
//         name: "camp2",
//         image: "https://climatekids.nasa.gov/review/tree-rings/trees.jpg",
//         description: "nice camp!"
//     }, function(err,camp){
//         if(err){
//             console.log("error!!!");
//         }
//         else{
//             console.log(camp);
//         }
        
// });

    // var campgrounds = [
    //         {name: "C1", image: "https://shorelineinclusivecamping.com/wp-content/uploads/2017/02/Furnished-Campsite-300x300.png"},
    //         {name: "C2", image: "https://shorelineinclusivecamping.com/wp-content/uploads/2017/02/Furnished-Campsite-300x300.png"},
    //         {name: "C3", image: "https://shorelineinclusivecamping.com/wp-content/uploads/2017/02/Furnished-Campsite-300x300.png"}
    //     ]

//Passport Configuration