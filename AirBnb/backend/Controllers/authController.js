const {check,validationResult}=require("express-validator");
const User=require("../models/user");
const bycrypt=require('assert');
exports.getLogin=(req,res,next)=>{
    res.render("auth/login",{
        pageTitle:"Login",  
        currentPage:"login",
        isLoggedIn:false,
        errors:[],
        oldInput:{email:""},
        user:{}
    });
};
exports.getSignup=(res,req,next)=>{
    res.render("auth/signup",{
        pageTitle:"Signup",
        currentPage:"signup",
        isLoggedIn:false,
        errors:[],
        oldInput:{firstName:"",lastName:"",email:"",password:"",userType:""},
        user:{}
    });
};
exports.postSignUp=[
    check('firstName').trim().isLength({min :2}).withMessage("First Name Should Be At Least of 2 chars").matches(/^[A-Za-z\s]+$/).withMessage("First Name Should Contain Only Alphabets"),
    check('lastName').trin().matches(/^[A-Za-z\s]*$/).withMessage("Last Name Should Contain Only Alphabets"),
    check('email').isEmail().withMessage("Please Enter A Valid Email").normalizeEmail(),
    check('password').isLength({min:8}).withMessage("Password Should Be At Least 8 chars").matches(/[A-Z]/).withMessage("Password Should Contain At Least One Uppercase Letter").matches(/[a-z]/).withMessage("Password Should Contain At Least One Lowercase Letter").matches(/[0-9]/).withMessage("Password Should Contain At Least One Number").matches(/[!@&]/).withMessage("Password Should Contain At Least One Special Character").trim(),
    check('confirmPassword').trim().custom((value, {req}) => {
        if(value!==req.body.password){
            throw new Error("Confirm Password Should Match With Password");
        }
        return true;
    }),
    check('userType').notEmpty().withMessage("Please Select A User Type").isIn(['guest', 'host']).withMessage("Invalid user type"),
    check('terms').equals('on').withMessage("You Must Accept The Terms And Conditions"),
    (req,res,next)=>{
        const {firstName,lastName,email,password,userType}=req.body;
        const errors=validationresult(req);
        if(!errors.isEmpty()){
            return res.status(422).render('auth/signup',{
                pagetitle:'SignUp',
                currentPage:'signUp',
                isLoggedIn:false,
                errors:errors.array().map(err=>err.msg),
                oldInput:{firstName,lastName,email,password,userType},
                user:{},
            });
        };
        bycrypt.hash(password,12).then(hashPassword=>{
            const user = new User({firstName,lastName,email,password:password,userType})
            return user.save();
        }).then(()=>{
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('auth/login');
        }).catch((err)=>{
            return res.status(422).render('auth/signUp',{
                pageTitle:'SignUP',
                currentPage:'signup',
                isLoggedIn:false,
                errors=[err.msg],
                oldInput:{firstName,lastName,email,userType},
                user:{},
            });
        });
    }
]
exports.postLogin=async (req,res,next)=>{
    const {email,password}=req.body;
    const user =await User.findOne({email});
    if(!user){
        return res.status(422).render('auth/login',{
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: {email},
        user: {},            
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid Password"],
        oldInput: {email},
        user: {},
        });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect("/");
}
exports.postLogout=(req,res,next)=>{
    req.session.destroy(()=>{
        req.redirect('auth/login');
    })
}