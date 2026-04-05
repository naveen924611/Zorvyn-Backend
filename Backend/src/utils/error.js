const err = (req, res) => {
  res.status(404).send("Endpoint not registered");
};
module.exports = err;

