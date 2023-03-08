const express = require("express");
const {
  validatePost,
  validatePut,
} = require("../../middlewares/validateMiddlewares");
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

// GET /api/contacts
router.get("/", listContacts);

// GET /api/contacts/:id
router.get("/:contactId", getById);

// POST /api/contacts
router.post("/", validatePost, addContact);

// DELETE /api/contacts/:id
router.delete("/:contactId", removeContact);

// PUT /api/contacts/:id
router.put("/:contactId", validatePut, updateContact);

module.exports = router;
