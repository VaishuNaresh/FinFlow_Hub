import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    //how we get request generally by using frontend  on using axios interceptor
    //  we can set the authorization header with the token and 
    // then we can access that token in the backend using req.headers.authorization
    
    
    let token = req.headers.authorization;// we get the token from the authorization header of the request 
    // and we check if the token is present and if it starts with Bearer and if it does not start with Bearer
    //  then we return a 401 status code and a message saying Not authorized and 
    // if it does start with Bearer then we split the token 
    // and get the second part of the token 
    // which is the actual token 
    // and we verify the token using jwt.verify method 
    // and we pass the token and the secret key 
    // which is stored in the environment variable ACCESS_TOKEN_SECRET
    //  and if the token is valid then we get the decoded payload 
    // which contains the user id and we use that id to find the user in the database 
    // and we select all fields except for password field and we attach that user object to the req.user property
    //  so that we can access it in the next middleware or route handler 
    // and if there is any error while verifying the token
    //  then we return a 401 status code and a message saying Token invalid

    if (!token || !token.startsWith("Bearer "))
        return res.status(401).json({ message: "Not authorized" });

    token = token.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalid" });
    }
};

