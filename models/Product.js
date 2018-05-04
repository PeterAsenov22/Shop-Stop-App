const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  name: {type: 'String', required: true},
  description: {type: 'String'},
  price: {
    type: 'Number',
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  },
  image: {type: 'String'},
  isBought: {type: 'Boolean', default: false},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
