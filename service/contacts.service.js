const Contacts = require("./schemas/contacts.shemas");

const listContacts = (userId) => Contacts.find({ owner: userId });

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
