const UserActivity = require('../models/UserActivity');

function logUserActivity(userId, route, beforeChanges, afterChanges) {
  UserActivity.create({
    userId,
    route,
    beforeChanges,
    afterChanges,
    createdAt: new Date()
  })
    .then(() => {
      console.log('User activity logged successfully.');
    })
    .catch((err) => {
      console.error('Error logging user activity:', err);
    });
}

module.exports = logUserActivity;