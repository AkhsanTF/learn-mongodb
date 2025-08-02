const mongoose = require("mongoose");

//Creating a Scheme
const contactScheme = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
});

//Creating new collections
const Contact = mongoose.model("Contact", contactScheme);

module.exports = Contact;
