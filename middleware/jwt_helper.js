const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const user = users.find((u) => u.refreshToken === refreshToken);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
