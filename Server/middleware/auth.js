const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Authentication

const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      throw new Error('Authorization Not Found');
    }
    // console.log(req.header('Authorization'))
    const token = await req.header('Authorization').split(' ')[1]
    // console.log(token.split(' ')[1])
    // const token = await req.header('Authorization').replace('Bearer', '');
    // console.log('token')
    // console.log(token)
    const decoded = jwt.verify(token, 'Niomic');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) throw new Error('Invalid Token');
    req.user = user;
    req.user.token = token;
    next();
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

module.exports = auth;
