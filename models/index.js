const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

//13.3.5 - create associations
User.hasMany(Post, { //one to many
    foreignKey: 'user_id'
});
Post.belongsTo(User, { //one to one
    foreignKey: 'user_id',
});
//13.4.3 
User.belongsToMany(Post, { //many to many 
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});
  
Post.belongsToMany(User, { //many to many 
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Vote, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});


module.exports = { User, Post, Vote, Comment };