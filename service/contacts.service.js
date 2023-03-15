const Contacts = require("./schemas/contacts.shemas");

const listContacts = () => Contacts.find();

const getById = async (contactId) => {
  return Contacts.findById(contactId);
  // const contactsList = await listContacts();
  // return contactsList.find(({ id }) => id === contactId);
};

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
