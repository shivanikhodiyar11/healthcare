const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const medicineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    mfgBy: { type: String, required: true, trim: true },
    sideEffects: { type: String },
  },
  { timestamps: true }
);
medicineSchema.index({ name: 1, dosage: 1, mfgBy: 1 }, { unique: true });
module.exports.validateMedicine = (medicine) => {
  const schema = Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim(),
        dosage: Joi.string().required().trim(),
        mfgBy: Joi.string().required().trim(),
        sideEffects: Joi.string(),
      })
    )
    .required()
    .min(1);
  return schema.validate(medicine);
};

module.exports.validateMedicineUpdate = (medicine) => {
  const schema = Joi.object({
    name: Joi.string().trim(),
    dosage: Joi.string().trim(),
    mfgBy: Joi.string().trim(),
    sideEffects: Joi.string(),
  });
  return schema.validate(medicine);
};

module.exports.Medicine = mongoose.model("Medicine", medicineSchema);
