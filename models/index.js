const User = require('./User');
const BlogEntry = require('./BlogEntry');

User.hasMany(BlogEntry, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

BlogEntry.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, BlogEntry };