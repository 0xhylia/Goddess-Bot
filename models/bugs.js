const mongoose = require('mongoose');
const { Schema } = mongoose;


const bugSchema = new Schema({
    bug: String,
    attachment: String,
    description: String,
    reCreate: String,
    priority: String,
    status: String,
    user: {
        username: String,
        id: String,
        avatar: String,
    },
    date: String,
})

module.exports = mongoose.model('bug', bugSchema);
