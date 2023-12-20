const mongoose = require('mongoose')


const dataSchema = new mongoose.Schema({
    
    nameOfDetail: {
        required: true,
        type: String
    },
    detail: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)