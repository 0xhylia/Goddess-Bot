const mongoose = require('mongoose');
const { Schema } = mongoose;




const vtuberSchema = new Schema({
    userId: String,
    youtube: String,
    twitter: String,
    twitch: String,
    instagram: String,
    tiktok: String,
    discord: String,
    isPremium: Boolean,
    isStaff: Boolean,
    description: String,
    banner: String,
    nickname: String,
    throne: String,
    vtuberModal: String,


})

module.exports = mongoose.model('vtuberProfile', vtuberSchema);
