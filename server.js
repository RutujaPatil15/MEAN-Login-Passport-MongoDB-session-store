var express = require('express');
var app = express();
var cors = require('cors');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var mongojs = require('mongojs');

app.use(cors());
//auth
//passport
/*{
    origin:['http://localhost:3000','http://127.0.0.1:3000'],
    credentials:true
  }*/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/project_one',
    collection: 'mySessions'
  });

  store.on('connected', function() {
    store.client; // The underlying MongoClient object from the MongoDB driver
  });

  // Catch errors
  store.on('error', function(error) {
    console.log(error);
  });

var db = mongojs('project_one',['doc_signup']);
app.use(session(
    {
    name:'myname.rutuja',
    resave:false,
    saveUninitialized:false,
    secret:'secret',
    cookie:{
    maxAge:60000,
    httpOnly:false,
    secure:false
    },
    store: store
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


  app.use (express.static(__dirname+"/public"));

app.post('/signup',function(req,res){
   // console.log(req);
    db.doc_signup.find({email:req.body.email},function(err,doc){
        if(!err)
        {
            if(doc.length===0)
            {bcrypt.hash(req.body.password, 10, function(err, hash) {
                // Store hash in your password DB.
                if(err){ res.json(false);};
                req.body.password=hash;
                db.doc_signup.insert(req.body,function (err, docs) {
                    console.log(docs);
                    if(!err)
                    {
                       // req.session.userId = docs._id;
                        res.json(true);
                    }
                    else
                    {
                        res.json(false);
                    }

                });
              });

            }
            else
            {
                res.json('duplicate');
            }

        }
        else
        {
            res.json(false);
        }
    })


});
passport.use('local',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    function (username, password, done) {
        db.doc_signup.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            var hash=user.password;
            bcrypt.compare(password, hash, function(err, ress) {
                //
                if(ress === true)
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            }) ;


        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    db.doc_signup.findOne({_id: mongojs.ObjectId(id)}, function(err, user) {
      done(err, user);
    });
  });
app.post('/login',function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.status(501).json(err); }
        if (!user) { return res.status(501).json(info); }
        req.logIn(user, function(err) {
          if (err) { return res.status(501).json(err); }
          return res.status(200).json({message:'Login Success'});
        });
      })(req, res, next);

});
app.get('/isuserloggedin',isValidUser,function(req,res,next){
    return res.status(200).json(req.user);
  });

  app.get('/logout',isValidUser, function(req,res,next){
    req.logout();
    return res.status(200).json({message:'Logout Success'});
  });

  function isValidUser(req,res,next){
    if(req.isAuthenticated()) next();
    else return res.status(401).json({message:'Unauthorized Request'});
  }

app.listen(3000);
console.log("server running on port 3000");
