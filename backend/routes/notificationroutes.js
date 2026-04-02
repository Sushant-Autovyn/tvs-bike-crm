const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');

const Notification = require('../models/notification');

const router = express.Router();

// Get all notifications
router.get('/', authMiddleware, async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });

  res.json({ notifications });
});

// Mark as read
router.put('/:id', authMiddleware, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true
  });

  res.json({ message: 'Marked as read' });
});

module.exports = router;