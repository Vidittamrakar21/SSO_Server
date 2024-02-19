import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Userschema = new Schema({

    email: String,
    name: String,
    token: String,
    date: {type: Date, default: Date.now}

});

module.exports = mongoose.model('users', Userschema);