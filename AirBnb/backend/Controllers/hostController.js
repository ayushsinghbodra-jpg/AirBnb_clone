const Home = require('../models/home');
const fs = require('fs');
exports.getAddHome=(res,req,next)=>{
    res.render('host/edit-home',{
        pageTitle:'Add Home To Airbnb',
        currentPage:'addHome',
        editing:false,
        isloggedIn:req.isloggedIn,
        user:req.sesson.user,
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
            isloggedIn:req.isloggedIn,
            user:req.sesson.user,
            home:home
        });
    });
};
expports.getHostHomes=(req,res,nest)=>{
    Home.find().then(registeredHomes=>{
        res.render('host/host-home-list',{
            pageTitle:'Host Homes List',   
            currentPage:'host-homes',
            isloggedIn:req.isloggedIn,
            user:req.sesson.user,
            registeredHomes:registeredHomes
        });
    });
};
exports.postAddHome=(req,res,next)=>{
    const {houseName,price,location,rating,description}=req.body;
    if(!req.file){
        return res.status(422).send('No image provided');
    }
    const photo= req.file.path;
    const home = new Home({
        houseName,
        price,
        lication,
        rating,
        description,
        photo
    });
    home.save().then(()=>{
        res.redirect('/host/host-home-list');
    });
};
exports.postAddHome=(req,res,next)=>{
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
            fs.unlink(home.photo,(err)=>{
                console.log('Error while deleting the photo',err);
            });
            home.photo=req.file.path;
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
        return Home.findByIdAndDelete(homeId);
    }).then(()=>{
        console.log('Home Deleted Successfully');
        res.redirect('/host/host-home-list');
    }).catch((err)=>{
        console.log('Error while deleting the home',err);
    });
};
