const Contacts = require("./schemas/contacts.shemas");

const listContacts = (findOptions, limit, skip) =>
  Contacts.find(findOptions).skip(skip).limit(limit);

const getById = (contactId) => Contacts.findById(contactId);

const addContact = (body) => Contacts.create(body);

const removeContact = (contactId) => Contacts.findByIdAndDelete(contactId);

const updateContact = (id, body) => Contacts.findByIdAndUpdate(id, body);

const updateStatusContact = (id, body) => Contacts.findByIdAndUpdate(id, body);

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
