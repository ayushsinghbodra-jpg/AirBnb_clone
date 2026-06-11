const Home = require('../models/home');
const fs = require('fs');
const path = require('path');
exports.getAddHome=(req,res,next)=>{
    res.render('host/edit-home',{
        pageTitle:'Add Home To Airbnb',
        currentPage:'addHome',
        editing:false,
        isLoggedIn:req.isLoggedIn,
        user:req.user,
        userType:res.locals.userType,
    });
};
exports.getEditHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    const editing=req.query.editing === "true";
    Home.findById(homeId).then(home=>{
        if(!home){
            return res.redirect('/host/host-home-list');
        }
        res.render('host/edit-home',{
            pageTitle:'Edit Home',
            currentPage:'host-homes',
            editing:editing,
            isLoggedIn:req.isLoggedIn,
            user:req.user,
            userType:res.locals.userType,
            home:home
        });
    });
};
exports.getHostHomes=(req,res,next)=>{
    Home.find().then(registeredHomes=>{
        res.render('host/host-home-list',{
            pageTitle:'Host Homes List',   
            currentPage:'host-homes',
            isLoggedIn:req.isLoggedIn,
            user:req.user,
            userType:res.locals.userType,
            registeredHomes:registeredHomes
        });
    });
};
exports.postAddHome=(req,res,next)=>{
    const {houseName,price,location,rating,description}=req.body;
    if(!req.file){
        return res.status(422).send('No image provided');
    }
    const photo= `/uploads/${req.file.filename}`;
    const home = new Home({
        houseName,
        price,
        location,
        rating,
        description,
        photo
    });
    home.save().then(()=>{
        res.redirect('/host/host-home-list');
    });
};
exports.postEditHome=(req,res,next)=>{
    const {id , houseName,price,location,rating,description}=req.body;
    Home.findById(id).then((home)=>{
        if(!home){
            return res.redirect('/host/host-home-list');
        }
        home.houseName=houseName;
        home.price=price;
        home.location=location;
        home.rating=rating;
        home.description=description;
        if(req.file){
            // Delete old photo if exists
            if(home.photo){
                const filename = home.photo.split('/').pop();
                const oldPhotoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', filename);
                fs.unlink(oldPhotoPath,(err)=>{
                    if(err) console.log('Error while deleting the photo',err);
                });
            }
            home.photo=`/uploads/${req.file.filename}`;
        };
        home.save().then((result)=>{
            console.log('Home Updated Successfully',result);
            res.redirect('/host/host-home-list');
        }).catch((err)=>{
            console.log('Error while updating the home',err);   
        });
    });
};
exports.postDeleteHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    Home.findById(homeId).then((home)=>{
        if(!home){
            return res.redirect('/host/host-home-list');
        }
        // Delete photo file if exists
        if(home.photo){
            const filename = home.photo.split('/').pop();
            const photoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', filename);
            fs.unlink(photoPath,(err)=>{
                if(err) console.log('Error while deleting the photo file',err);
            });
        }
        return Home.findByIdAndDelete(homeId);
    }).then(()=>{
        console.log('Home Deleted Successfully');
        res.redirect('/host/host-home-list');
    }).catch((err)=>{
        console.log('Error while deleting the home',err);
    });
};
