const jwt = require("jsonwebtoken");

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
