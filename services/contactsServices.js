import { promises as fsPromises } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db/contacts.json");

async function listContacts() {
  const data = await fsPromises.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function findContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fsPromises.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(body) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  await fsPromises.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContact(id, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  await fsPromises.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export default {
  listContacts,
  findContactById,
  removeContact,
  addContact,
  updateContact,
};
