var mysql = require('../db/db');

function User(user){
    this.username = user.username;
    this.password = user.password;
    this.sex = user.sex;
    this.photo = user.photo
}

User.prototype.add = function(callback){
    var post ={
        user_name: this.username,
        password: this.password,
        sex : this.sex,
        photo: this.photo
    };

    var sql = "insert into user set?";
    mysql.query(sql, post, function(err, results,fields){
        if(err){
            console.log(err.message);
        }else{
            console.log(results);
            return callback(err,fields);
        }
    })
};

User.get = function(username, callback){
    var sql = "select * from user where user_name = '"+username+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results[0],fields);
        }
    })
};

User.getById = function(userid,callback){
    var sql = "select * from user where user_id = '"+userid+"'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            callback(err,results[0],fields);
        }
    })
};
module.exports = User;