const mongoose = require('mongoose');

const captchaSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true
    }
},
{ 
    timestamps: false 
});

const CaptchaModel = mongoose.model("Captcha", captchaSchema);
module.exports = CaptchaModel;
