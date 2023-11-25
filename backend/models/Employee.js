const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
  firstName: String,
  // Add more fields
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
