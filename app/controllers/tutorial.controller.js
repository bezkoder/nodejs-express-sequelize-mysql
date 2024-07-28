const db = require("../models");
const { tutorials: Tutorial, Sequelize: { Op } } = db;

// Error handler
const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).send({ message });
};

// Request validation
const validateRequest = (req, res, fields) => {
  for (const field of fields) {
    if (!req.body[field]) {
      handleError(res, `${field} can not be empty!`, 400);
      return false;
    }
  }
  return true;
};

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  if (!validateRequest(req, res, ['title'])) return;

  try {
    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published || false
    };
    const data = await Tutorial.create(tutorial);
    res.send(data);
  } catch (err) {
    handleError(res, err.message || "Some error occurred while creating the Tutorial.");
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  try {
    const { title } = req.query;
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const data = await Tutorial.findAll({ where: condition });
    res.send(data);
  } catch (err) {
    handleError(res, err.message || "Some error occurred while retrieving tutorials.");
  }
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Tutorial.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      handleError(res, `Cannot find Tutorial with id=${id}.`, 404);
    }
  } catch (err) {
    handleError(res, `Error retrieving Tutorial with id=${id}`);
  }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const [num] = await Tutorial.update(req.body, { where: { id } });
    if (num === 1) {
      res.send({ message: "Tutorial was updated successfully." });
    } else {
      handleError(res, `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`, 400);
    }
  } catch (err) {
    handleError(res, `Error updating Tutorial with id=${id}`);
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await Tutorial.destroy({ where: { id } });
    if (num === 1) {
      res.send({ message: "Tutorial was deleted successfully!" });
    } else {
      handleError(res, `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`, 404);
    }
  } catch (err) {
    handleError(res, `Could not delete Tutorial with id=${id}`);
  }
};

// Delete all Tutorials from the database.
exports.deleteAll = async (req, res) => {
  try {
    const nums = await Tutorial.destroy({ where: {}, truncate: false });
    res.send({ message: `${nums} Tutorials were deleted successfully!` });
  } catch (err) {
    handleError(res, err.message || "Some error occurred while removing all tutorials.");
  }
};

// Find all published Tutorials
exports.findAllPublished = async (req, res) => {
  try {
    const data = await Tutorial.findAll({ where: { published: true } });
    res.send(data);
  } catch (err) {
    handleError(res, err.message || "Some error occurred while retrieving tutorials.");
  }
};
