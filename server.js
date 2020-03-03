const expressValidator = require('express-validator');
const expressSession = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const ejs = require('ejs');
const path = require('path')
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const multer = require('multer');
const sharp = require('sharp');
var imageName;
const app = express();

app.locals.moment=require('moment');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use(expressSession({
  secret: 'soykot',
  saveUninitialized: false,
  resave: false
}));
app.use(express.static("./public"));

// var storage=multer.diskStorage({
//   destination: './public/uploads',
//   filename:function(req,file,cb){
//      imageName=file.fieldname + '_'+ Date.now()+path.extname(file.originalname);
//     cb(null,file.fieldname + '_'+ Date.now()+path.extname(file.originalname));
//   }
// });

// var upload= multer({
//     storage:storage,
//     limits: {
//       fileSize: 100000000
//   },
//   fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Please upload an image'))
//       }
//       cb(undefined, true)
//   }
// }).single('image');

mongoose.connect('mongodb://localhost:27017/profileDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log("Mongodb Connection Succeeded");
  } else {
    console.log("Error in Db connection");
  }
});

const profileSchema = {
  name: String,
  email: String,
  password: String,
  imagePathe: {
    type: Buffer
  }
}

const memberSchema = {
  name: String,
  email: String,
  mobile: String,
  address: String,
  password:String,
  imagePathe: {
    type: Buffer
  }
}

const mealSchema = {
  name: String,
  meal: Number,
  date: String
}
const depositeSchema = {
  name: String,
  amount: Number,
  date: String
}

const bazarSchema={
  name:String,
  amount:Number,
  description:String,
  date:String
}

const Bazar=mongoose.model("Bazar",bazarSchema);
const Profile = mongoose.model("Profile", profileSchema);
const Member = mongoose.model("Member", memberSchema);
const Meal = mongoose.model("Meal", mealSchema);
const Deposite = mongoose.model("Deposite", depositeSchema);
const upload = multer({
  // dest:'./public/uploads',
  limits: {
    fileSize: 100000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})


// app.get('/', (req, res, next) => {
//   res.render('index', {
//     title: 'form validator',
//     success: req.session.success,
//     errors: req.session.errors
//   });

//   req.session.errors = null;
// })


app.post('/upload', upload.single('image'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({
    width: 250,
    height: 250
  }).png().toBuffer();

  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.file.buffer);
  const profile = new Profile({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    imagePathe: buffer
  });

  await profile.save();

  req.check('name', 'Name is required').notEmpty();
  req.check('email', 'Invalid email').isEmail();
  req.check('password', 'password invallid').isLength({
    min: 2
  }).equals(req.body.confirmpassword);

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;

  } else {
    req.session.success = true;
  }
  //   upload(req,res,(err)=>{
  //     if(err){
  //       console.log("error in image"+err);
  //     }else{
  //       console.log("image saved");
  //       console.log(imageName);
  //     }
  // });

  res.redirect('/');
});

app.get("/upload", function (req, res) {
  Profile.find({}, function (err, found) {
    if (!err) {
      res.render("image", {
        postContent: found
      });
    }
  });
});

app.get('/upload/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      throw new Error();
    }

    res.set('Content-Type', 'image');
    res.send(profile.imagePathe);
  } catch (e) {
    res.status(400).send();
  }
})

app.get('/', (req, res) => {
  res.render('login');
})

var userName;
var UserMeal;
var mobileNum;
var userDeposite;
app.post('/login',(req,res)=>{
  console.log(req.body);
 
   const enterName=req.body.name;
  const enterPassword=req.body.password;
  Member.findOne({name:enterName},(err,foundMember)=>{
    if(err){
      console.log(err);
    }else{
      if(foundMember){
        if(foundMember.password===enterPassword){
          userName=foundMember.name;
          mobileNum=foundMember.mobile;
          Bazar.find({},function(err,postContent){
            totalbazar=0;
            for(var x=0;x<postContent.length;x++){
              totalbazar=totalbazar+postContent[x].amount;
              console.log(totalbazar);
             }
            return totalbazar;
          })
          
          Deposite.find({},function(err,postContent){
            totaldeposit=0;
            for(var x=0;x<postContent.length;x++){
              totaldeposit=totaldeposit+postContent[x].amount;
              console.log(totaldeposit);
             }
            return totaldeposit;
          })
          Meal.findOne({name:enterName},(err,foundMeal)=>{
            if(err){
              console.log(err)
            }else{
             UserMeal=0;
             UserMeal=UserMeal+foundMeal.meal;
            }
          })
          Deposite.findOne({name:enterName},(err,foundDeposite)=>{
            if(err){
              console.log(err)
            }else{
             userDeposite=0;
             userDeposite=userDeposite+foundDeposite.amount;
            }
          })
          
          Meal.find({}, function (err, postContent) {
             totalmeal=0;
            for(var x=0;x<postContent.length;x++){
              totalmeal=totalmeal+postContent[x].meal;
             }
              console.log(totalmeal);
             
          })
          let date_ob = new Date();
        
          // current date
          // adjust 0 before single digit date
          let date = ("0" + date_ob.getDate()+"-"+("0"+(date_ob.getMonth()+1))+"-"+date_ob.getFullYear());
          
            console.log(date);

            res.render("home", {
              totalmeal:totalmeal,
              totalbazar:totalbazar,
              totaldeposite:totaldeposit,
              userName:userName,
              UserMeal:UserMeal,
              userImage:foundMember,
              mobileNum:mobileNum,
              userDeposite:userDeposite,
              date:date
            });
        }else{
          res.send("password not matching");
        }
      }else{
        res.send("user Name not found");
      }
    }
  })
})

app.get('/bazar', (req, res) => {
  Bazar.find({}, function (err, postContent) {
    if (!err) {
      res.render("bazar", {
        postContent: postContent,
        num: num
      });
    }
  });
})



app.post('/add-bazar',(req,res)=>{
  console.log(req.body);
  const bazar=new Bazar({
    name:req.body.name,
    amount:req.body.amount,
    description:req.body.description,
    date:req.body.date
  })
  bazar.save();
  res.redirect('/bazar');
})




app.post('/add-deposite', (req, res) => {
  console.log(req.body);

  const deposite = new Deposite({
    name: req.body.name,
    amount: req.body.amount,
    date: req.body.date
  });

  deposite.save();
  res.redirect('/deposit');
})

var num = 1;
app.get('/deposit', (req, res) => {
  Deposite.find({}, function (err, postContent) {
    if (!err) {
      res.render("deposit", {
        postContent: postContent,
        num: num
      });
    }
  });
})



app.get('/meal',(req,res)=>{
  Meal.find({}, function (err, postContent) {
    if (!err) {
      res.render("meal", {
        postContent: postContent,
        num: num
      });
    }
    
  });

})
var totalmeal;
var totalbazar;
var totaldeposit;
app.get('/home', (req, res) => {
 
  Bazar.find({},function(err,postContent){
    totalbazar=0;
    for(var x=0;x<postContent.length;x++){
      totalbazar=totalbazar+postContent[x].amount;
      console.log(totalbazar);
     }
    return totalbazar;
  })
  
  Deposite.find({},function(err,postContent){
    totaldeposit=0;
    for(var x=0;x<postContent.length;x++){
      totaldeposit=totaldeposit+postContent[x].amount;
      console.log(totaldeposit);
     }
    return totaldeposit;
  })
  
  Meal.find({}, function (err, postContent) {
     totalmeal=0;
    for(var x=0;x<postContent.length;x++){
      totalmeal=totalmeal+postContent[x].meal;
     }
      console.log(totalmeal);
     
  })
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()+"-"+("0"+(date_ob.getMonth()+1))+"-"+date_ob.getFullYear());
  
    console.log(date);

    
    res.render("home", {
      totalmeal:totalmeal,
      totalbazar:totalbazar,
      totaldeposite:totaldeposit,
      userName:userName,
      UserMeal:UserMeal,
      userImage:userImage,
      mobileNum:mobileNum,
      userDeposite:userDeposite,
      date:date
    });

 
  
})

app.post('/add-meal',(req,res)=>{
  const meal=new Meal({
    name:req.body.name,
    meal:req.body.meal,
    date:req.body.date
  })
  meal.save();
  res.redirect('/meal');
})

app.post('/add-member', upload.single('image'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({
    width: 250,
    height: 250
  }).png().toBuffer();

  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.mobile);
  console.log(req.body.address);
  console.log(req.body.password);
  //  console.log(req.file.buffer);
  const member = new Member({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    address: req.body.address,
    password:req.body.password,
    imagePathe: buffer
  });

  await member.save();

  req.check('name', 'Name is required').notEmpty();
  req.check('email', 'Invalid email').isEmail();
  req.check('mobile', 'Invalid number').isNumeric();
  req.check('address', 'Invalid address').isString();
  // req.check('password','password invallid').isLength({min:2}).equals(req.body.confirmpassword);

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;

  } else {
    req.session.success = true;
  }
  //   upload(req,res,(err)=>{
  //     if(err){
  //       console.log("error in image"+err);
  //     }else{
  //       console.log("image saved");
  //       console.log(imageName);
  //     }
  // });

  res.redirect('/member');
});
var num = 1;
app.get('/member', (req, res) => {
  Member.find({}, function (err, postContent) {
    if (!err) {
      res.render("member", {
        postContent: postContent,
        num: num
      });
    }
  });
})
app.get('/member/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      throw new Error();
    }

    res.set('Content-Type', 'image');
    res.send(member.imagePathe);
  } catch (e) {
    res.status(400).send();
  }
})


app.get('/register', (req, res) => {
  res.redirect('/member');
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})