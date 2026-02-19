// import jwt from "jsonwebtoken";

// const isAuth = async (req, res, next) => {
//   try {
//     let { token } = req.cookies;
//     if (!token) {
//       return res.status(400).json({ message: "User does not have token" });
//     }
//     let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
//     if (!verifyToken) {
//       return res
//         .status(400)
//         .json({ message: "User does not have valid token" });
//     }

//     req.userId = verifyToken.userId;
//     next();
//   } catch (error) {
//     return res.status(500).json({ message: "isAuth error" });
//   }
// };




import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;
