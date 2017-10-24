var express = require('express');
var router = express.Router();
var User = require('../models/User');
var crypto = require('crypto');
//GET   homepage 
router.get('/', function (req, res) {
  res.render('homepage');
});
// POST /addUser    add new user
router.post('/addUser', function(req, res, next){
  try {
    if (!(req.body.username.length >= 3 && req.body.username.length <= 15)) {
      throw new Error('name will be ...');
    }
    if (req.body.password.length < 6) {
      throw new Error('Your password must be at least 6 characters.');
    }
    if (req.body['re_password'] != req.body['password']) {
      throw new Error('password can not match two times');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/');
  }


  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var sex = req.body.sex;
  if (sex == 0){
    var photo = 'male.png';
  }else if (sex == 1){
    var photo = 'female.png';
  }
  var newUser = new User({
    username: req.body.username,
    password: password,
    sex: req.body.sex,
    photo: photo
  });
  // check username is already exists or not
  User.get(newUser.username, function (err, user){
    if(user){
      req.flash('error', 'This username is already taken!');
      return res.redirect('/');
    }

    newUser.add(function (err){
      req.flash('success', 'sign up success! please log in now');
     return res.redirect('/');
    })
  })
});
// POST /login      log in 
router.post('/login',function(req,res,next){
  var md5 = crypto.createHash('md5');
  var username = req.body.username;
  var password = md5.update(req.body.password).digest('base64');
  //var password = req.body.password;
  
  User.get(username, function(err, user){
    if(!user){
      req.flash('error', 'Username is not found!');
      return res.redirect('/');
    }
    if(user.password != password){
      req.flash('error', 'Password is not correct!');
      return res.redirect('/');
    }
    req.session.user = user;
    req.flash('success', 'Welcome back');
    return res.redirect('/message');
  })
});
//GET  /log out     log out
router.get('/logout', function(req, res, next) {
  // 清空 session 中用户信息
  req.session.user = null;
  req.flash('success', 'Log out successfully');
  // 登出成功后跳转到主页
  res.redirect('/');
});
router.use('/message', require('./message'));
module.exports = router;
