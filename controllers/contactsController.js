const catchAsync = require("../utils/catchAsync");
const contactsService = require("../service/contacts.service");

const getContactsList = catchAsync(async (req, res) => {
  res.status(200).json(await contactsService.listContacts());
});

const getContactById = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
});

const createContact = catchAsync(async (req, res) => {
  const { name, email, phone, favorite = false } = req.body;
  const newContact = await contactsService.addContact({
    name,
    email,
    phone,
    favorite,
  });

  res.status(201).json(newContact);
});

const deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  await contactsService.removeContact(contactId);
  res.status(200).json({ message: "contact deleted" });
});

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
