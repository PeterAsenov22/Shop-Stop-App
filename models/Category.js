const mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
  name: {type: 'String', required: true, unique: true},
  products: [{type: 'ObjectId', ref: 'Product'}]
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category
