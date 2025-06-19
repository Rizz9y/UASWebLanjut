const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message:
            "Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.",
        });
    }
    next();
  };
};

module.exports = { checkRole };
