import jwt from "jsonwebtoken";

export const verifyStudentToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token)
            res.status(401).send("Access Denied");
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }
        console.log("jwt secret", process.env.JWT_SECRET);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("verified", verified);
        if(verified && (verified.role === "admin" || verified.role ==="student")){
            req.user = verified;
            next();
        } else {
            res.status(403).json({ isSuccess: false, message: "not allowed"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export const verifyAdminToken = async(req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token)
            res.status(401).send("Access Denied");
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified && verified.role === "admin"){
            req.user = verified;
            next();
        } else {
            res.status(403).json({ isSuccess: false, message: "not allowed"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export const verifyEmployerToken = async(req, res, next) => {
    try {
        let token = req.header("Authorization");
        if(!token)
            res.status(401).send("Access Denied");
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified && (verified.role === "admin" || verified.role === "teacher")){
            req.email = verified.email;
            req.id = verified.id;
            next();
        } else {
            res.status(403).json({ isSuccess: false, message: "not allowed"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}