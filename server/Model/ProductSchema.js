const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    files: {
        type: [String]
    }
  });

  const Product = mongoose.model('Product', ProductSchema);

  module.exports =  Product;