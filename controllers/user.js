const User = require('../models/User');

// @desc    Get user by ID
// @route   GET /api/user/:id
// @access  Private
exports.getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select('-hashed_password -salt');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user
// @route   PUT /api/user/update
// @access  Private
exports.updateUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    let user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password should be min 6 characters long',
        });
      } else {
        user.password = password;
      }
    }

    const updatedUser = await user.save();

    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
