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

router.get("/", listContacts);
router.post("/", validatePost, addContact);

router.get("/:contactId", getById);
router.delete("/:contactId", removeContact);
router.put("/:contactId", validatePut, updateContact);

module.exports = router;
