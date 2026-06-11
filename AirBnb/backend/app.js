const path = require('path');
const express= require('express');
const session=require('express-session');
const MongoDbStore=require('connect-mongodb-session')(session);
const {default:mongoose}=require('mongoose');
const multer=require('multer');
require('dotenv').config();
const DbPath=process.env.MONGODB_URI || "mongodb+srv://root:root@airbnb-cluster.hhfgjl1.mongodb.net/?appName=airbnb-cluster";
//Local Module;
const storeRouter = require("./Routes/storeRouter")
const hostRouter = require("./Routes/hostRouter")
const authRouter = require("./Routes/authRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./Controllers/error");
const app=express();
app.set('view engine','ejs');
app.set('views', path.join(rootDir, '..', 'frontend', 'views'));
const store=new MongoDbStore({
    uri:DbPath,
    collection:'sessions'
});

store.on('error', (err) => {
    console.log('Session store error:', err);
});

store.on('connected', () => {
    console.log('Session store connected to MongoDB');
});
const randomString=(length)=>{
    const characters="abcdefghijklmnopqrstuvwxyz";
    let result="";
    for(let i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result;
};
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(rootDir,'..','frontend','public','images'));
    },filename:(req,file,cb)=>{
        cb(null,randomString(10)+'-'+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};
const multerOptions={
    storage,fileFilter
};
app.use(express.urlencoded({extended:true}));
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir,'..','frontend','public')));
app.use('/uploads',express.static(path.join(rootDir,'..','frontend','public','images')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'Ayush Kumar SIngh',
    resave : false,
    saveUninitialized : true,
    store: store,
    cookie: { 
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 24,
        httpOnly: true
    },
    name: 'sessionId'
}));
app.use(async (req,res,next)=>{
    const sessionId = req.sessionID;
    const isLoggedIn = req.session?.isLoggedIn || false;
    const userId = req.session?.userId;
    const userEmail = req.session?.userEmail;
    const userType = req.session?.userType;
    
    req.isLoggedIn = isLoggedIn;
    req.user = null;
    res.locals.isLoggedIn = isLoggedIn;
    res.locals.user = null;
    res.locals.userEmail = userEmail;
    res.locals.userType = userType;
    
    if (isLoggedIn && userId) {
        try {
            const User = require('./models/user');
            req.user = await User.findById(userId);
            res.locals.user = req.user;
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    }
    
    console.log('Session middleware - sessionId:', sessionId, 'isLoggedIn:', isLoggedIn, 'userEmail:', userEmail);
    next();
});
app.use('/',storeRouter);
app.use('/auth',authRouter);
app.use('/host',(req,res,next)=>{
    if(req.isLoggedIn){
        next();
    }else{
        res.redirect('/auth/login');
    }
});
app.use('/host',hostRouter);
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Unexpected file field. Expected "photo" field.' });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
});
app.use(errorsController.pageNotFound);
const PORT = process.env.PORT || 3000;
console.log("Attempting to connect to MongoDB...");
console.log("Connection string:", DbPath);
mongoose.connect(DbPath, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
}).then(()=>{
    console.log("✓ Connected to MongoDB successfully");
    app.listen(PORT,()=>{
        console.log(`✓ Server is running on address http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log('✗ Error while connecting to MongoDB:');
    console.log(err.message);
    console.log('\nMake sure MongoDB is running at:');
    console.log(DbPath);
    process.exit(1);
});
