// Generate the CAPTCHA image

const { createCanvas } = require('canvas');
const CaptchaModel = require('../models/captcha');

exports.generateCaptchaImage = () => {

  const text = Math.random().toString(36).substring(2, 6).toLowerCase(); // '36' is the base for alphanumeric
  const canvas = createCanvas(150, 50);
  const ctx = canvas.getContext('2d');

  // Add background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set font and color
  ctx.font = '30px Arial';
  ctx.fillStyle = '#000';

  // Draw the CAPTCHA text
  ctx.fillText(text, 20, 35);

  // Convert canvas to base64-encoded PNG
  return [text, canvas.toDataURL('image/png')];
}

exports.verifyCaptcha = async (hex, answer) => {
    if(!hex) {
       return [false, { msg: "invalid hex" }];
    }
    const result = await CaptchaModel.findById(hex);
    if(!result) {
       return [false, { msg: "invalid token" }];
    }
    if(result.text !== answer) {
       return [false, { msg: "mismatch token" }];
    }
    return [true, { msg: "success" }];
}