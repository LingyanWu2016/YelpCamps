

var express     = require("express"),

    app         = express(),

    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local").Strategy,
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment = require("./models/comment"),
    User    = require("./models/user"),
    seedDB = require("./seeds")
    
  mongoose.connect("mongodb://lingyan:a123456@ds125673.mlab.com:25673/yelpcamps")
//mongoose.connect("mongodb://localhost/yelp_camp")
//mongodb://lingyan:a123456@ds125673.mlab.com:25673/yelpcamps
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB() 

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
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

app.get("/",function(req,res){
    res.render("landing");
});



app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});

