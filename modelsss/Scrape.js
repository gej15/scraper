  
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ScrapeSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // 'value' is required and of type sting
  des: {
    type: String,
    required: false
  },

  pic:{
    type: String,
    required: false
  },
});

// This creates our model from the above schema, using mongoose's model method
var Scrape = mongoose.model("Scrape", ScrapeSchema);

// Export the Article model
module.exports = Scrape;