const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const diseaseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    causes: { type: String, required: true, trim: true },
    treatment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
diseaseSchema.index({ name: 1, causes: 1, treatment: 1 }, { unique: true });
module.exports.validateDisease = (disease) => {
  const schema = Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim(),
        causes: Joi.string().required().trim(),
        treatment: Joi.string().required().trim(),
      })
    )
    .required()
    .min(1);
  return schema.validate(disease);
};

module.exports.validateDiseaseUpdate = (disease) => {
  const schema = Joi.object({
    name: Joi.string().trim(),
    causes: Joi.string().trim(),
    treatment: Joi.string().trim(),
  });
  return schema.validate(disease);
};

module.exports.Disease = mongoose.model("Disease", diseaseSchema);
