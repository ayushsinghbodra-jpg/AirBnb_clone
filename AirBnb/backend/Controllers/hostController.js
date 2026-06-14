const Home = require('../models/home');
const fs = require('fs');
const path = require('path');
const uploadImage = require('../utils/uploadImage.js');
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
exports.postAddHome=async(req,res,next)=>{
    try {
        const {houseName,price,location,rating,description}=req.body;
        if(!req.file){
            return res.status(422).send('No image provided');
        }
        const uploadedImage = await uploadImage(
            'airbnb_clone',
            req.file.path
        );
        // Delete local image file after Cloudinary upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting local image:', err);
        });
        const home = new Home({
            houseName,
            price,
            location,
            rating,
            description,
            photo: {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            }
        });
        home.save().then(()=>{
            res.redirect('/host/host-home-list');
        }).catch((err)=>{
            console.error('Error saving home:', err);
            res.status(500).send('Error saving home');
        });
    } catch (error) {
        console.error('Error in postAddHome:', error);
        res.status(500).send(error.message);
    }
};
exports.postEditHome=async(req,res,next)=>{
    try {
        const {id , houseName,price,location,rating,description}=req.body;
    Home.findById(id).then(async(home)=>{
        if(!home){
            return res.redirect('/host/host-home-list');
        }
        home.houseName=houseName;
        home.price=price;
        home.location=location;
        home.rating=rating;
        home.description=description;
        if(req.file){
            if(home.photo){
                const filename = home.photo.split('/').pop();
                const oldPhotoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', filename);
                fs.unlink(oldPhotoPath,(err)=>{
                    if(err) console.log('Error while deleting the photo',err);
                });
            }
            const uploadedImage = await uploadImage(
                "airbnb_clone",
                req.file.path
            );
            // Delete local image file after Cloudinary upload
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting local image:', err);
            });
            home.photo = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            };
        };
        home.save().then((result)=>{
            console.log('Home Updated Successfully',result);
            res.redirect('/host/host-home-list');
        }).catch((err)=>{
            console.error('Error updating home:', err);
            res.status(500).send('Error updating home');
        });
        }).catch((err)=>{
            console.error('Error finding home:', err);
            res.status(500).send('Error finding home');
        });
    } catch (error) {
        console.error('Error in postEditHome:', error);
        res.status(500).send(error.message);
    }
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
