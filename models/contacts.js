const fs = require("fs/promises");
const uuid = require("uuid").v4;

const feachContactsList = async () =>
  JSON.parse(await fs.readFile("./models/contacts.json"));

/**
 * Get contacts list
 * @returns {name:string, email:string, phone:string}[]
 */
const listContacts = async (req, res) => {
  try {
    return res.status(200).json(await feachContactsList());
  } catch (error) {
    return error;
  }
};

/**
 * Get contsct by ID
 * @param {string} contactId
 * @returns {name:string, email:string, phone:string}
 */
const getById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contactList = await feachContactsList();

    const contact = contactList.find(({ id }) => id === contactId);
    if (contact) {
      return res.status(200).json(contact);
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return error;
  }
};

/**
 * Create contsct
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {name:string, email:string, phone:string}
 */
const addContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = { id: uuid(), name, email, phone };
    const contactsList = await feachContactsList();

    res.status(201).json(newContact);

    contactsList.push(newContact);
    await fs.writeFile("./models/contacts.json", JSON.stringify(contactsList));
    return newContact;
  } catch (error) {
    return error;
  }
};

/**
 * Delete contact by ID
 * @param {string} contactId
 */
const removeContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contactsList = await feachContactsList();

    const contact = contactsList.find(({ id }) => id === contactId);
    const idx = contactsList.findIndex(({ id }) => id === contactId);

    if (contact) {
      contactsList.splice(idx, 1);

      await fs.writeFile(
        "./models/contacts.json",
        JSON.stringify(contactsList)
      );
      res.status(200).json({ message: "contact deleted" });
      return;
    }
    res.status(404).json({ message: "Not found" });
  } catch (error) {
    return error;
  }
};

/**
 * Updata contact by ID
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {name:string, email:string, phone:string}
 */
const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const contactsList = await feachContactsList();

    const contact = contactsList.find(({ id }) => id === contactId);
    const idx = contactsList.findIndex(({ id }) => id === contactId);

    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phone) contact.phone = phone;

    contactsList.splice(idx, 1, contact);

    res.json(contact);
    await fs.writeFile("./models/contacts.json", JSON.stringify(contactsList));
    return contact;
  } catch (error) {
    return error;
  }
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
