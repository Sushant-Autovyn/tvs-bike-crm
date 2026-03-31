const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalCustomers: 1284,
      activeLeads: 86,
      bikesSoldThisMonth: 42,
      serviceBookings: 67,
      revenueThisMonth: 2840000,
      stockAvailable: 156
    };

    const recentActivities = [
      {
        title: 'New bike sold',
        time: '12 min ago',
        type: 'sale'
      },
      {
        title: 'Service booking created',
        time: '38 min ago',
        type: 'service'
      },
      {
        title: 'New customer added',
        time: '1 hour ago',
        type: 'customer'
      }
    ];

    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      stats,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};