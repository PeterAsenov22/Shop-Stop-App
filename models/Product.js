const mongoose = require('mongoose')
const propertyIsRequired = '{0} is required.'

let productSchema = mongoose.Schema({
  name: {type: 'String', required: propertyIsRequired.replace('{0}', 'Name')},
  description: {type: 'String', required: propertyIsRequired.replace('{0}', 'Description')},
  price: {
    type: 'Number',
    min: 0,
    max: Number.MAX_VALUE,
    required: propertyIsRequired.replace('{0}', 'Price')
  },
  image: {type: 'String', required: propertyIsRequired.replace('{0}', 'Image')},
  createdOn: {type: mongoose.Schema.Types.Date, required: true},
  buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
