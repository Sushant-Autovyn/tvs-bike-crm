const Notification = require('../models/notification');

const createNotification = async (title, message, type) => {
  try {
    await Notification.create({
      title,
      message,
      type
    });
  } catch (error) {
    console.log('Notification error:', error.message);
  }
};

module.exports = createNotification;