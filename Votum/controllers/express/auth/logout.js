const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res
        .status(400)
        .json({
          success: false,
          status: 400,
          error: 'Nie udało się wylogować',
          errorDetails: err
        });
      return 0;
    }
    res.status(200).json({ success: true, status: 200 });
  });
};

module.exports = logout;
