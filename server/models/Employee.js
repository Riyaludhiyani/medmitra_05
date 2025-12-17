const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  vaccineName: String,
  doseNumber: Number,
  totalDoses: Number,
  nextDoseDate: String, // store YYYY-MM-DD
  completed: { type: Boolean, default: false }
});

// -----------------------------------------
// UPDATED SCHEMA (Must include notifications)
// -----------------------------------------
const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: String,
  gender: String,
  address: String,
  city: String,
  state: String,
  
  // Phone numbers as Strings to prevent errors
  phone1: String, 
  phone2: String,
  phonemem1: String, 
  phonemem2: String,
  
  blood: String,
  disease: String,
  medicine: String,
  member1 : String,
  member2 : String,
  
  // ✅ THIS SECTION WAS MISSING CAUSING THE 500 ERROR
  notifications: [
    {
      message: String,
      type: String, 
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ],
  
  vaccinations: [
    {
      vaccineName: String,
      nextDoseDate: String,
      doseNumber: Number,
      totalDoses: Number,
      completed: { type: Boolean, default: false }
    }
  ]
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
