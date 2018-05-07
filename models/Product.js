const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  name: {type: 'String', required: true},
  description: {type: 'String', required: true},
  price: {
    type: 'Number',
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  },
  image: {type: 'String'},
  buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
