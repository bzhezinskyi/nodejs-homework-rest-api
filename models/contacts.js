const fs = require("fs/promises");

const listContacts = async () => {
  try {
    return JSON.parse(await fs.readFile("./models/contacts.json"));
  } catch (error) {
    return error.message;
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsList = await listContacts();

    return contactsList.find(({ id }) => id === contactId);
  } catch (error) {
    return error.message;
  }
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  try {
    const contactsList = await listContacts();
    contactsList.push(body);
    await fs.writeFile("./models/contacts.json", JSON.stringify(contactsList));
    return body;
  } catch (error) {
    return error.message;
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
