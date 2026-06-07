const path = require('path');
const express= require('express');
const session=require('express-session');
const MongoDbStore=require('connect-mongodb-session')(session);
const {default:mongoose}=require('mongoose');
const multer=require('multer');
const DbPath="";
//Local Module;
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const app=express();
app.set('view engine','ejs');
app.set('views' , 'views');
const store=new MongoDbStore({
    uri:DbPath,
    collection:'sessions'
});
const randomString=(length)=>{
    const characters="abcdefghijklmnopqrstuvwxyz";
    let result="";
    for(let i=0;i<length;i++){
        result+=chararcters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result;
};
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
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
app.use(multer(multerOptions).single('image'));
app.use(express.static(path.join(rootDir,'public')));
app.use('/uploads',express.static(path.join(rootDir,'uploads')));
app.use(session({
    secret:'Ayush Kumar SIngh',
    resave : false,
    saveUninitialized : false,
    store: store
}));
app.get((req,res,next)=>{
    req.isLoggedIn=req.session.isloggedIn;
    next();
});
app.use('/auth',authRouter);
app.use('/store',storeRouter);
app.use('/host',(req,res,next)=>{
    if(req.isLoggedIn){
        next();
    }else{
        res.redirect('/auth/login');
    }
});
app.use('/host',hostRouter);
app.use(errorsController.pageNotFound);
const PORT=3000;
mongoose.connect(DbPath).then(()=>{
    console.log("Connected to MongoB");
    app.listen(PORT,()=>{
        console.log(`Server is running on address http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log('Error while connecting the MongoDb',err);
});
