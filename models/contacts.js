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

const removeContact = async (contactId) => {
  try {
    const contactsList = await listContacts();

    const contact = contactsList.find(({ id }) => id === contactId);

    if (contact) {
      const newContactList = contactsList.map(({ id }) => id !== contactId);
      await fs.writeFile(
        "./models/contacts.json",
        JSON.stringify(newContactList)
      );
    }
    return contact;
  } catch (error) {
    return error.message;
  }
};

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

const updateContact = async (contactId, body) => {
  try {
    const contactsList = await listContacts();

    const contact = contactsList.find(({ id }) => id === contactId);
    const idx = contactsList.findIndex(({ id }) => id === contactId);

    if (body.name) contact.name = body.name;
    if (body.email) contact.email = body.email;
    if (body.phone) contact.phone = body.phone;

    contactsList.splice(idx, 1, contact);

    await fs.writeFile("./models/contacts.json", JSON.stringify(contactsList));
    return contact;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
