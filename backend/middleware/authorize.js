const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // diasumsikan req.user sudah diisi dari middleware auth

    console.log(`User role: ${userRole}, Allowed roles: ${allowedRoles}`);
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

export default authorize;