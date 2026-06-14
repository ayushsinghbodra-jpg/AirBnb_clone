const Home= require('../models/home');
const User=require('../models/user');
exports.getIndex=(req,res,next)=>{
    console.log('getIndex - isLoggedIn:', req.isLoggedIn, 'user:', req.user?.email, 'userType:', req.user?.userType);
    Home.find().then((registeredHomes)=>{
        res.render('store/index',{
            registeredHomes:registeredHomes,
            pageTitle:'AirBnb',
            currentPage:'index',
            isLoggedIn:req.isLoggedIn,
            user:req.user,
        });
    }).catch((err)=>{
        console.log('Error fetching homes:', err);
        res.status(500).render('store/index',{
            registeredHomes:[],
            pageTitle:'AirBnb',
            currentPage:'index',
            isLoggedIn:req.isLoggedIn,
            user:req.user,
        });
    });
};
exports.getHomes=(req,res,next)=>{
    Home.find().then((registeredHomes)=>{
        res.render('store/home-list',{
            registeredHomes:registeredHomes,
            pageTitle:'Homes List',
            currentPage:'Home',
            isLoggedIn:req.isLoggedIn, 
            user:req.user,
        });
    }).catch((err)=>{
        console.log('Error fetching homes:', err);
        res.status(500).render('store/home-list',{
            registeredHomes:[],
            pageTitle:'Homes List',
            currentPage:'Home',
            isLoggedIn:req.isLoggedIn, 
            user:req.user,
        });
    });
};
exports.getBookings=(req,res,next)=>{
    res.render('store/bookings',{
        pageTitle:'My Bookings',    
        currentPage:'bookings',
        isLoggedIn:req.isLoggedIn, 
        user:req.user,
    });
};
exports.getFavouritesList=async(req,res,next)=>{
    if(!req.user){
        return res.redirect('/auth/login');
    }
    const user=await User.findById(req.user._id).populate('favourites');
    res.render('store/favourite-list',{
        favouriteHomes:user.favourites,
        pageTitle:'My Favourites',    
        currentPage:'favourites',   
        isLoggedIn:req.isLoggedIn, 
        user:req.user,
        userType:res.locals.userType,
    });
};
exports.postAddToFavourite=async(req,res,next)=>{
    if(!req.user){
        return res.redirect('/auth/login');
    }
    try {
        const homeId=req.body.id;
        console.log('Adding favourite - homeId:', homeId, 'current favourites:', req.user.favourites);
        if(!homeId){
            return res.status(400).send('Home ID is required');
        }
        const user=req.user;
        // Check if already in favourites using toString() for proper comparison
        const exists = user.favourites.some(fav => fav.toString() === homeId);
        if(!exists){
            user.favourites.push(homeId);
            await user.save();
            console.log('Favourite added successfully');
        } else {
            console.log('Home already in favourites');
        }
        res.redirect('/favourites');
    } catch (err) {
        console.error('Error adding to favourites:', err);
        res.status(500).send('Error adding to favourites');
    }
};
exports.postRemoveFromFavourite=async(req,res,next)=>{
    if(!req.user){
        return res.redirect('/auth/login');
    }
    try {
        const homeId=req.params.homeId;
        console.log('Removing favourite - homeId:', homeId, 'user favourites:', req.user.favourites);
        if(!homeId){
            return res.status(400).send('Home ID is required');
        }
        const user=req.user;
        const index = user.favourites.findIndex(fav => fav.toString() === homeId);
        if(index !== -1){   
            user.favourites.splice(index, 1);
            await user.save();
            console.log('Favourite removed successfully');
        }
        res.redirect('/favourites');
    } catch (err) {
        console.error('Error removing from favourites:', err);
        res.status(500).send('Error removing from favourites');
    }
};
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn, 
        user: req.user,
        userType: req.user?.userType,
      });
    }
  });
};