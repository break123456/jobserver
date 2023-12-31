const jwt = require("jsonwebtoken");

//this will block api in case token is not valid 
exports.verifyStudentToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token)
            res.status(401).send("Access Denied");
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }
        //console.log("jwt secret", process.env.JWT_SECRET);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(403).json({ isSuccess: false, message: "Forbidden: Invalid token"});
            } else {
                req.user = decoded;
                next();   
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.checkStudentLoggedIn = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(token)
        {
            if(token.startsWith("Bearer ")){
                token = token.slice(7, token.length).trimLeft();
            }
            //console.log("jwt secret", process.env.JWT_SECRET);
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) {
                    return res.status(403).json({ isSuccess: false, message: "Forbidden: Invalid token"});
                } else {
                    //now check is user is valid or not 
                    //const userObj = User.findById(de)
                    req.user = decoded;
                }
            });
        }
        next();  
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.verifyEmployerToken = async(req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token)
            res.status(401).send("Access Denied");
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }
        //console.log("jwt secret", process.env.JWT_SECRET);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(403).json({ isSuccess: false, message: "Forbidden: Invalid token"});
            } else {
                req.user = decoded;
                next();   
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.verifyAdminToken = async(req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token)
            res.status(401).send("Access Denied");
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }
        //console.log("jwt secret", process.env.JWT_SECRET);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(403).json({ isSuccess: false, message: "Forbidden: Invalid token"});
            } else {
                req.user = decoded;
                next();   
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
