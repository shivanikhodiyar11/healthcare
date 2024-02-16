const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const nurseTaskSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    taskTitle: { type: String, required: true },
    taskDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Under Process", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports.validateNurseTask = (task) => {
  const schema = Joi.object({
    patient: Joi.string().required(),
    taskTitle: Joi.string().required(),
    taskDescription: Joi.string().required(),
    status: Joi.string()
      .valid("Pending", "Under Process", "Completed")
      .default("Pending"),
  });
  return schema.validate(task);
};

module.exports.validateNurseTaskUpdate = (task) => {
  const schema = Joi.object({
    patient: Joi.string(),
    taskTitle: Joi.string(),
    taskDescription: Joi.string(),
    status: Joi.string()
      .valid("Pending", "Under Process", "Completed")
      .default("Pending"),
  });
  return schema.validate(task);
};

module.exports.NurseTask = mongoose.model("NurseTask", nurseTaskSchema);
