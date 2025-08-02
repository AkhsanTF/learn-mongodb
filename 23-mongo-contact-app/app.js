const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("./utils/db.js");
const Contact = require("./model/contact.js");
const { body, validationResult } = require("express-validator"); //import validator module

const app = express();
const port = 3000;

app.use(expressLayouts); //using express layout for a middleware of a page template
app.set("layout", "layouts/main-layout");
app.set("view engine", "ejs"); //using ejs as a view engine
app.use(express.static("public")); //utilize public directory to serve img and css
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Mongo Contact App | Listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  const students = [];
  res.render("index", {
    title: "My Website",
    students,
  });
}); //route to index page

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
  });
}); //route to about page

//route to contact page
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  const added = req.query.added;
  const deleted = req.query.deleted;
  const edited = req.query.edited;

  res.render("contact", {
    title: "Contact Page",
    contacts,
    added,
    deleted,
    edited,
  });
}); //function to provide contact.ejs information of current event

//page add contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Data Contact Form",
  });
});

//process add data contact
app.post(
  "/contact",
  [
    //validator email
    body("email").isEmail().withMessage("Email is not valid!"),
    //validator phone number
    body("phone")
      .isMobilePhone("id-ID")
      .withMessage("Phone number is not valid!"),
    //validator if name already in list
    body("name").custom(async (value) => {
      const duplicate = await Contact.findOne({ name: value });
      if (duplicate) {
        throw new Error("Contact name already in list!");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add Data Contact Form",
        errors: errors.array(),
      }); //function if error happen
    } else {
      await Contact.insertMany(req.body);
      res.redirect("/contact?added=1"); //added=1 used to inform add-contact.ejs to pop up flash message
    }
  }
); //function if added success

//delete contact process
app.get("/contact/delete/:name", async (req, res) => {
  const contact = Contact.findOne({ name: req.params.name });

  //if contact is not on the list
  if (!contact) {
    res.status(404);
    res.send("<h1>404<h1>");
  } else {
    await Contact.deleteOne({ name: req.params.name });
    res.redirect("/contact?deleted=1");
  }
});

//edit contact form
app.get("/contact/edit/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("edit-contact", {
    title: "Edit Data Contact Form",
    contact,
  });
});

//edit contact process
app.post(
  "/contact/update",
  [
    //validator email
    body("email").isEmail().withMessage("Email is not valid!"),
    //validator phone number
    body("phone")
      .isMobilePhone("id-ID")
      .withMessage("Phone number is not valid!"),
    //validator if name already in list
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Contact name already in list!");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit Data Contact Form",
        errors: errors.array(),
        contact: req.body,
      }); //function if error happen
    } else {
      await Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
          },
        }
      );
      //   updateContact(req.body);
      res.redirect("/contact?edited=1"); //edited=1 used to inform edit-contact.ejs to pop up flash message
    } //function if edit success
  }
);

//page detail contact
app.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", {
    title: "Detail Contact Page",
    contact,
  });
});
