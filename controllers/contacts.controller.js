const { catchAsync } = require("../utils");
const contactsService = require("../service/contacts.service");

//  GET /api/contacts
const getContactsList = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, favorite } = req.query;
  const userId = req.user._id;

  const findOptions = favorite
    ? { owner: userId, favorite }
    : { owner: userId };
  console.log(findOptions);

  const skip = (+page - 1) * +limit;

  res
    .status(200)
    .json(await contactsService.listContacts(findOptions, limit, skip));
});

//  GET /api/contacts/:contactId
const getContactById = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
});

//  POST /api/contacts
const createContact = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { name, email, phone, favorite = false } = req.body;

  const newContact = await contactsService.addContact({
    name,
    email,
    phone,
    favorite,
    owner: userId,
  });

  res.status(201).json(newContact);
});

//  DELETE /api/contacts/:contactId
const deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  await contactsService.removeContact(contactId);
  res.status(200).json({ message: "contact deleted" });
});

//  PUT /api/contacts/:contactId
const updateContactById = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  if (name) contact.name = name;
  if (email) contact.email = email;
  if (phone) contact.phone = phone;

  await contactsService.updateContact(contactId, contact);
  res.status(200).json(contact);
});

//  PATCH /api/contacts/:contactId/favorite
const updateFavoriteStatusContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  if (req.body !== {} && (favorite === false || favorite === true)) {
    contact.favorite = favorite;

    await contactsService.updateStatusContact(contactId, contact);
    res.status(200).json(contact);
  } else {
    res.status(400).json({ message: "missing field favorite" });
  }
});

module.exports = {
  getContactsList,
  getContactById,
  deleteContact,
  createContact,
  updateContactById,
  updateFavoriteStatusContact,
};
