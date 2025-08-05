const User = require('../models/User');
const NetBanking = require('../models/NetBanking');

exports.getUserDetails = async (req, res) => {
  try {
    const { uniqueid } = req.params;

    if (!uniqueid) {
      // Agar uniqueid missing ho to JSON response bhejna theek hai
      return res.status(400).json({ success: false, error: 'Missing uniqueid in URL' });
    }

    // User aur NetBanking data parallel me fetch kar lo
    const [user, netBanking] = await Promise.all([
      User.findOne({ uniqueid }),
      NetBanking.findOne({ uniqueid })
    ]);

    // Agar dono jagah data nahi mila to render karo detail page with error message
    if (!user && !netBanking) {
      return res.status(404).render('detail', {
        error: 'No data found for this uniqueid',
        user: null,
        netBanking: null
      });
    }

    // Agar data mila to detail.ejs render karo with data and no error
    res.render('detail', {
      user,
      netBanking,
      error: null
    });

  } catch (error) {
    console.error('Error in getUserDetails:', error);
    // Agar server error hua to JSON bhejo
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
