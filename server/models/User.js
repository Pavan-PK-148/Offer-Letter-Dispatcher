const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an administrator name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid destination email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a secure password'],
    minlength: 6
  },
  role: {
    type: String,
    default: 'Platform Admin'
  }
}, { timestamps: true });

// Pre-save Middleware: Hash administrative passwords automatically before committing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance Method: Match decrypted password attempts securely
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);