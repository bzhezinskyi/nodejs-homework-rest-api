const express = require("express");
const uuid = require("uuid").v4;
const {
  listContacts,
  getContactById,
  addContact,
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

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if ((name, email, phone)) {
      res
        .status(201)
        .json(await addContact({ id: uuid(), name, email, phone }));
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  } catch (error) {}
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
