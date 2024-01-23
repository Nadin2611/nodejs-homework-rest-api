import { Contact } from "../shemas/contactsSchemas.js";
// import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
};

// export const getContactById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const contactById = await contactsService.findContactById(id);

//     if (!contactById) {
//       throw HttpError(404);
//     }

//     res.json(contactById);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deletedContact = await contactsService.removeContact(id);
//     if (!deletedContact) {
//       throw HttpError(404);
//     }
//     res.json({ message: "Contact deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

export const createContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// export const updateContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updatedContact = await contactsService.updateContact(id, req.body);

//     if (!updatedContact) {
//       throw HttpError(404);
//     }
//     res.json(updatedContact);
//   } catch (error) {
//     next(error);
//   }
// };
