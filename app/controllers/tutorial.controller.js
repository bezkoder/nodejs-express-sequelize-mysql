const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  const { title, description, published } = req.body;
  // Validate request
  if (!title) {
    return res.status(400).json({ message: "Content can not be empty!" });
  }

  // Create a Tutorial
  const tutorial = {
    title,
    description,
    published: req.body.published || false
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).json({ message: err.message || "Some error occurred while creating the Tutorial." });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { title } = req.query;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Tutorial.findAll({ where: condition })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const { id } = req.params;

  Tutorial.findByPk(id)
    .then(data => {
      if (data) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: `Cannot find Tutorial with id=${id}.` });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: `Error retrieving Tutorial with id=${id}` });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;

  Tutorial.update(req.body, {
    where: { id }
  })
    .then(num => {
      if (num === 1) {
        return res.status(200).json({ message: "Tutorial was updated successfully." });
      } else {
        return res.status(400).json({ message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!` });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: `Error updating Tutorial with id= ${id}` });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;

  Tutorial.destroy({
    where: { id }
  })
    .then(num => {
      if (num === 1) {
        return res.status(200).json({ message: "Tutorial was deleted successfully!" });
      } else {
        return res.status(404).json({ message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!` });
      }
    })
    .catch(err => {
      return res.status(500).json({ message: `Could not delete Tutorial with id=${id}` });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      return res.status(200).json({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      return res.status(500).json({ message: err.message || "Some error occurred while removing all tutorials." });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).json({ message: err.message || "Some error occurred while retrieving tutorials." });
    });
};
