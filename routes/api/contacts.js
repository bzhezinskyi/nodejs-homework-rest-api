const express = require("express");
const validateMiddlewares = require("../../middlewares/validateMiddlewares");
const uuid = require("uuid").v4;
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", validateMiddlewares.validatePost, async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (name && email && phone) {
    res.status(201).json(await addContact({ id: uuid(), name, email, phone }));
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (contact) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  // const validate = schemaPut.validate({ name, email, phone });
  if (name || email || phone) {
    res.json(await updateContact(contactId, { name, email, phone }));
  } else {
    res.status(400).json({ message: "missing fields" });
  }
});

module.exports = router;
