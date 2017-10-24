var express = require('express');
var router = express.Router();
var Message = require('../models/Message');
var isAuthenticated = require('../middlewares/isAuthenticated').isAuthenticated;
var Comment = require('../models/Comment');
var User = require('../models/User');
// POST /message      Post a new message
router.post('/', isAuthenticated, function(req, res, next) {
  var currentUser = req.session.user;
  var message_content = req.body.message_content;
  try {
    if (!message_content.length) {
      throw new Error('Please say something...');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/message');
  }
  var message = new Message(currentUser.user_name,message_content);
  message.add(function (err){
    if (err) {
      req.flash('error', err);
      return  res.redirect('/message');
    }
    req.flash('success', ' post a new message successfully!');
    res.redirect('/message');
  });

});
// GET /message       List all messages
router.get('/', isAuthenticated,function(req, res,next) {
  var currentUser = req.session.user;
  var author = req.query.user;
  var content = req.query.search_content;
  if(content != null){
    Message.getByKey(content,function(err,message){
      res.render('Lists',{
        message: message,
        user:currentUser
      })
    })
  }else {
    Message.get(author,function(err,message){
      res.render('Lists',{
        message: message,
        user:currentUser
      })
    })
}
});
// GET /message/messageId  Get a message by messageId
router.get('/:messageId',isAuthenticated,function(req,res,next){
  var messageId = req.params.messageId;
  var CurrUserId = req.session.user.user_id;
  Message.getById(messageId,function(err,message){
      Comment.get(messageId,function(err,comment){
        console.log(comment);
        for(var i in comment){
        }
        var postArray = [];
        for(var i in comment){
          var post ={
            comment_id: comment[i].comment_id,
            photo: comment[i].photo,
            user_name: comment[i].user_name,
            comment_content: comment[i].comment_content,
            comment_by_user_id:comment[i].comment_by_user_id,
            current_user_id : CurrUserId
          };
          postArray.push(post);
        }
        console.log(postArray);
        res.send(postArray);
      });
  });
});
//GET  /message/:messageId/remove   remove a message by messageId
router.get('/:messageId/remove',function(req,res,next){
  var messageId = req.params.messageId;
  var currUserId = req.session.user.user_id;
  Comment.removeAll(messageId,function(err,message){
    Message.remove(messageId,currUserId,function(err,message){
        req.flash('success','delete a message successfully!');
        res.redirect('/message');
      });
  });
});
//GET /message/:messageId/edit  edit a message by messageId
router.get('/:messageId/edit',function(req,res,next){
  var messageId = req.params.messageId;
  var user_id = req.session.user.user_id;
  Message.getById(messageId,function(err,message) {
    res.render('edit',{
      message: message
    })
  })
});
// POST /message/:messageId/edit  updaete a message
router.post('/:messageId/edit',function(req,res,next){
  var user = req.session.user;
  var user_id = req.session.user.user_id;
  var message_id = req.params.messageId;
  var content = req.body.content;
  Message.editById(message_id,content,function(err,message){
    if (err) {
      req.flash('error', err);
      return  res.redirect('/message');
    }else{
      req.flash('success', 'update a message successfully!');
      res.redirect('/message');
    }

  })
});
//POST /message/:messageId/comment       create a comment
router.post('/:messageId/comment',function(req,res,next){
  var user_id = req.session.user.user_id;
  var message_id = req.params.messageId;
  var comment_content = req.body.comment_content;
  var comment = new Comment(user_id,comment_content,message_id);
  comment.add(function(err){
    if (err) {
      req.flash('error', err);
      return  res.redirect('/message');
    }
    req.flash('success', 'leave a new comment successfully!');
    res.redirect('/message');
  })
});
//GET  /message/:messageId/comment/:commentId/remove    remove a comment
router.get('/:messageId/comment/:commentId/remove',function(req,res,next){
  var commentId = req.params.commentId;
  var user_id = req.session.user.user_id;
  Comment.removeById(commentId,user_id,function(err,message){
    req.flash('success','delete a comment successfully!');
    res.redirect('/message');
  })
});
module.exports = router;





