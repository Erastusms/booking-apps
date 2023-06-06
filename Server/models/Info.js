const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const infoSchema = new mongoose.Schema({
  infoName: {
    type: String,
    required: [true, 'Please Input Info Name!'],
  },
  type: {
    type: String,
    required: [true, 'Please Input Info Type!'],
  },
  isHighlight: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, 'Please Input Info Description!'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  item: [{
    type: ObjectId,
    ref: 'Item',
  }],
});

module.exports = mongoose.model('Info', infoSchema);
