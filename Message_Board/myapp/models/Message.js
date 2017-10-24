var mysql = require('../db/db');
var comment = require('./Comment');

function Message(username,message_content,date){
    this.username = username;
    this.message_content = message_content;
    if(date){
        this.date = date;
    }else{
        this.date = new Date();
        console.log(this.date);
    }
}
//  add a new message
Message.prototype.add = function(callback){
    var sql = "select user_id from user where user_name = '"+this.username+"' ";
    var content = this.message_content;
    var date = this.date;
    mysql.query(sql, function(err,results,fields){
        if(err){
            throw err;
        }
        if(results){
            this.user_id = results[0].user_id;
            console.log(this.user_id);
        }
        var message ={
            message_user_id: this.user_id,
            message_content: content,
            date: date
        };

        var sql = "insert into message set?";
        mysql.query(sql, message, function(err, results,fields){
            if(err){
                console.log(err.message);
            }else{
                console.log(results);
                return callback(err,fields);
            }
        });
    });

};
//  get all messages
Message.get = function(userid, callback){
    var sql = "select * from message left join user on user_id = message.message_user_id order by message_id  desc";
    if(userid){
        sql ="select * from message left join user on user_id = message.message_user_id where user_id='" + userid+"' order by message_id  desc";
    }
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
//  get a message by message_id
Message.getById = function(messageId,callback){
    var sql = "select * from message join user on user_id = message.message_user_id where message_id = '"+ messageId+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }

    })
};
//  get a message by keywords
Message.getByKey = function(content,callback){
    var sql = "select * from message join user on user_id = message.message_user_id where message_content like '%"+ content+"%' or user_name like '%"+ content+"%' ";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
//  edit a message by message_id and user_id
Message.editById = function(messageId,content,callback){
    var sql = "update message set message_content = '"+ content+"' where  message_id = '"+ messageId+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
// remove a message by message_id
Message.remove = function(message_id,user_id,callback){
    var sql = "delete from message where message_id = '"+ message_id+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results,fields);
        }
    })
};
module.exports = Message;