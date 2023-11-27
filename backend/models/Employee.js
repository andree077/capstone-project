const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new mongoose.Schema({
  firstName: {
      type: String,
      required: true
  },
  lastName: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  phone: {
      type: String,
      required: false
  },
  dob: {
      type: Date,
      required: false
  },
  address: {
    type: String,
    required: false
},
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
