const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect('mongodb+srv://keerthanaprakash4work:8VSmWsj2QTNX3xkf@cluster0.bdnpt15.mongodb.net/devTinder');
}

module.exports = {connectDB}

