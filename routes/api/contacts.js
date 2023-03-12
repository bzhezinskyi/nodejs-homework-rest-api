const express = require("express");

const {
  validatePost,
  validatePut,
} = require("../../middlewares/validateMiddlewares");
const {
  getContactsList,
  getContactById,
  deleteContact,
  createContact,
  updateContactById,
  updateFavoriteStatusContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.route("/").get(getContactsList).post(validatePost, createContact);

router
  .route("/:contactId")
  .get(getContactById)
  .delete(deleteContact)
  .put(validatePut, updateContactById);

router.route("/:contactId/favorite").patch(updateFavoriteStatusContact);

module.exports = router;
