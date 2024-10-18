const mongoose = require('mongoose')
const { generateCaptchaImage } =  require('../helper/captcha-util');
const CaptchaModel = require('../models/captcha');
const {sendMailUtil} = require('../helper/mail-util');

exports.generate = async (req, res) => {

    const [text, img] = generateCaptchaImage();
    const entry = new CaptchaModel({text: text});
    const result = await entry.save();

    return res.status(200).json({ img: img, hex: result._id });
}

exports.verify = async (req, res) => {
    const {hex, answer} = req.body;
    if(!hex) {
       return res.status(201).json({ msg: "invalid access" });
    }
    const result = await CaptchaModel.findById(hex);
    if(!result) {
        return res.status(201).json({ msg: "invalid token" });
    }
    if(result.text !== answer) {
        return res.status(201).json({ msg: "mismatch token" });
    }

    return res.status(200).json({ msg: "success" });
}

exports.sendMail = async (req, res) => {
    const {subject, text, to} = req.body;
    if(!subject || !text || !to) {
       return res.status(201).json({ msg: "invalid input" });
    }

    const [status, reason] = await sendMailUtil(subject, text, to);
    if(!status) {
        return res.status(201).json({ msg: reason });
    }
    
    return res.status(200).json({ msg: "success" });
}