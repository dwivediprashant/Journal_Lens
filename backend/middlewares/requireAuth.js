import { getAuth } from "@clerk/express";

const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      msg: "Authentication required !",
    });
  }
  req.userId = userId;

  next();
};

export default requireAuth;
