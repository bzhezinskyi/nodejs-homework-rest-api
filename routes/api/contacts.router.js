const express = require("express");

const {
  validateContactsCreate,
  validateContactsUpdata,
} = require("../../middlewares/validateContacts.middlewares");
const {
  getContactsList,
  getContactById,
  deleteContact,
  createContact,
  updateContactById,
  updateFavoriteStatusContact,
} = require("../../controllers/contacts.controller");
const { validToken } = require("../../middlewares/validToken.middlewares");

//  /api/contacts
const contactsRouter = express.Router();

contactsRouter
  .route("/")
  .all(validToken)
  .get(getContactsList)
  .post(validateContactsCreate, createContact);

contactsRouter
  .route("/:contactId")
  .all(validToken)
  .get(getContactById)
  .delete(deleteContact)
  .put(validateContactsUpdata, updateContactById);

contactsRouter
  .route("/:contactId/favorite")
  .all(validToken)
  .patch(updateFavoriteStatusContact);

module.exports = contactsRouter;
