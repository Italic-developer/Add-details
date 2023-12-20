const mongoose = require('mongoose')


const dataSchema = new mongoose.Schema({
    
    nameOfDetail: {
        required: true,
        type: String
    },
    detail: {
        required: true,
        type: string
    }
})

module.exports = mongoose.model('Data', dataSchema)