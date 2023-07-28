const User = require('../models/user')
const jwt = require('jsonwebtoken')
const settings = require('../configs/settings')

exports.userSignup = async(request, response)=>{
    try {
        const exist = await User.findOne({email: request.body.email});

        if(exist){
            return response.json({
                success:false,
                message: "user already exist"
            });
        }
        const user = request.body;
        if(user.role == "student")
          user.role = 0;
        else 
          user.role = 1;
        console.log(user)
        const newUser = new User(user);
        await newUser.save();
         
        response
         .status(200)
         .json({
          success: true,
          data: { 
            },
        });
    } catch (error) {
        response
         .status(402)
         .json({
          success: true,
          data: { 
            msg : "database error"
            },
        });
        console.log("Error:", error.message)
    }
}

exports.userLogin = async(request, response) =>{
    try {
        const user = await User.findOne({email: request.body.email, password: request.body.password});

        if(user){
            const token = jwt.sign({id: user._id}, 
                settings.config.passport.secret, {expiresIn: "1h"} );
            response
             .status(200)
            .json({
            success: true,
            data: {
              id: user._id,
              email: user.email,
              token: token,
            },
       });
        }else{
            response.json({
                success:false,
                message: "invalid user"
            });
        }
    } catch (error) {
        console.log("Error:", error.message)
    }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
