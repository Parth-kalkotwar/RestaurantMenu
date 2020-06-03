const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var dishSchema = require("./dishSchema");

var FavouriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dish: [{ type: Schema.Types.ObjectId, ref: "Dish" }],
});

var Favorites = mongoose.model("Favorite", FavouriteSchema);
module.exports = Favorites;
