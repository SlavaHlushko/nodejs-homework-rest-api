const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set e-mail for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const addContactSchema = Joi.object({
  name: Joi.string().label("name field").min(3).max(25).required(),
  email: Joi.string()
    .label("email field")
    .email({ minDomainSegments: 2 })
    .required(),
  phone: Joi.string()
    .label("phone field")
    .min(3)
    .trim()
    .max(15)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": `Phone number can contain from 3 to 15 digits.`,
    })
    .required(),
  favorite: Joi.bool(),
})
  .required()
  .min(3)
  .message("missing required name field");

const updContactSchema = Joi.object({
  name: Joi.string().label("name field").min(2).max(25),
  email: Joi.string().label("email field").email({ minDomainSegments: 2 }),
  phone: Joi.string()
    .label("phone field")
    .min(3)
    .max(15)
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": `Phone number can contain from 3 to 15 digits.`,
    }),
  favorite: Joi.bool(),
})
  .required()
  .min(1)
  .message("missing fields");

const updateFavoriteSchema = Joi.object({
  favorite: Joi.bool(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  addContactSchema,
  updContactSchema,
  updateFavoriteSchema,
};
