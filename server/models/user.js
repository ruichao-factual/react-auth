import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

mongoose.Promise = require('bluebird');

// Define out modal
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

userSchema.pre('save', function(next) {
  const saltRounds = 10;
  bcrypt.hash(this.password, saltRounds).then((hash) => {
    this.password = hash;
    next();
  }).catch((err) => {
    next(err);
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password).then((isMatch) => {
    callback(null, isMatch);
  }).catch((err) => {
    callback(err);
  })
}

// Create the modal class
const User = mongoose.model('user', userSchema);

export default User;

