const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/zaktDB";

mongoose.connect(url);

// //adding 1 data
// const contact1 = new Contact({
//   name: "akbar",
//   email: "akbar@gmail.com",
//   phone: "08185821572",
// });

// //save to collections
// contact1.save().then((contact) => console.log(contact));
