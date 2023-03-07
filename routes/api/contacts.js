const express = require("express");
const {
  validatePost,
  validatePut,
} = require("../../middlewares/validateMiddlewares");
const uuid = require("uuid").v4;
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

// GET /api/contacts
router.get("/", async (req, res, next) => {
  res.json(await listContacts());
});

// GET /api/contacts/:id
router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getById(contactId);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// POST /api/contacts
router.post("/", validatePost, async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (name && email && phone) {
    res.status(201).json(await addContact({ id: uuid(), name, email, phone }));
  }
});

// DELETE /api/contacts/:id
router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (contact) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// PUT /api/contacts/:id
router.put("/:contactId", validatePut, async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  if (name || email || phone) {
    res.json(await updateContact(contactId, { name, email, phone }));
  }
});

module.exports = router;
