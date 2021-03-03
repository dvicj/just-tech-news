const User = require('./User');
const Post = require('./Post');

//13.3.5 - create associations
User.hasMany(Post, { //one to many
    foreignKey: 'user_id'
});
Post.belongsTo(User, { //many to one
    foreignKey: 'user_id',
});


module.exports = { User, Post };