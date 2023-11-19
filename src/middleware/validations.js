export const passwordValidator = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (await isValid(password)) {
      next();
    } else {
      res.status(500).json({ message: "Enter a valid password" });
    }
  } catch (err) {
    res.status(500).json({ message: `request failed ${err}` });
  }
};

const isValid = async (password) => {
  return true;
};
