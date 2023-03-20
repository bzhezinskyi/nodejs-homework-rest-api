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

const router = express.Router();

router
  .route("/")
  .all(validToken)
  .get(getContactsList)
  .post(validateContactsCreate, createContact);

router
  .route("/:contactId")
  .all(validToken)
  .get(getContactById)
  .delete(deleteContact)
  .put(validateContactsUpdata, updateContactById);

router
  .route("/:contactId/favorite")
  .all(validToken)
  .patch(updateFavoriteStatusContact);

module.exports = router;
