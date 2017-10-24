var mysql = require('../db/db');

function Comment(user_id,comment_content,comment_message_id,date){
    this.user_id = user_id;
    this.comment_content = comment_content;
    this.comment_message_id = comment_message_id;
    if(date){
        this.date = date;
    }else{
        this.date = new Date();
        console.log(this.date);
    }
}
// add a new comment 
Comment.prototype.add = function(callback){

    var post ={
        comment_by_user_id: this.user_id,
        comment_content: this.comment_content,
        comment_message_id:this.comment_message_id,
        date: this.date
    };
    var sql = "insert into comment set?";
    mysql.query(sql, post, function(err, results,fields){
        if(err){
            console.log(err.message);
        }else{
            console.log(results);
            return callback(err,fields);
        }
    });
};
// get all comments by message_id
Comment.get = function(message_id, callback){
    var sql = "select * from comment join user on user_id = comment.comment_by_user_id where comment_message_id = '"+ message_id+"' ";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
Comment.getAll = function(callback){
    var sql = "select * from comment ";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
// remove a comment by comment_id and user_id
Comment.removeById = function(comment_id,user_id,callback){
    var sql = "delete from comment where comment_id = '"+ comment_id+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
// remove all comments by message_id
Comment.removeAll = function(message_id,callback){
    var sql = "delete from comment where comment_message_id = '"+ message_id+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
module.exports = Comment;