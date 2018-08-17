var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX ROUTE

router.get("/", function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE ROUTE

router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcamp = {name: name, price:price, image:image, description:description, author:author};
    Campground.create(newcamp, function(err,newcamp){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newcamp");
});

// SHOW ROUTE

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundcamp);
            res.render("campgrounds/show",{campground: foundcamp});
        }
    });
});

// EDIT ROUTE

router.get("/:id/edit", middleware.checkOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundcamp});
        }
    });
});

// UPDATE ROUTE

router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE

router.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// MIDDLEWARE

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundcamp){
//         if(err){
//             res.redirect("back");
//         } else {
//             if(foundcamp.author.id.equals(req.user._id)){
//                 next();
//             } else {
//                 res.redirect("back");
//             }
//         }
//     });
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = router;