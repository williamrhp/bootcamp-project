var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkOwnership = function(req, res, next){
        if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            req.flash("error", "campground not found");
            res.redirect("back");
        } else {
            if(foundcamp.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "user does not have permission");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "not logged in");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundcomment){
        if(err){
            req.flash("error", "comment not found");
            res.redirect("back");
        } else {
            if(foundcomment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "user does not have permission");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "not logged in");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first!");
    res.redirect("/login");
}

module.exports = middlewareObj;