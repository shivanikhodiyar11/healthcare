const {
  validateDisease,
  Disease,
  validateDiseaseUpdate,
} = require("../Models/disease.model");
const { Prescription } = require("../Models/prescription.model");

const addDisease = async (req, res, next) => {
  const { error, value } = validateDisease(req.body);
  if (error) return res.status(404).send(error.message);
  Disease.insertMany(value, { ordered: false }, function (err, docs) {
    console.log(err, docs, this);
    if (err) {
      res.status(202).send(err);
    } else {
      res.status(200).send("Diseases Inserted Successfully !!!");
    }
  });
};

const getDiseases = async (req, res, next) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 5);
  const { search } = req.query;
  const searchQuery = { $regex: search, $options: "i" };
  const endIndex = (page - 1) * limit;
  try {
    const diseases = await Disease.find({
      $or: [{ name: searchQuery }],
    })
      .select(" -__v -createdAt")
      .skip(endIndex)
      .limit(limit);
    const count = await Disease.count();
    if (!diseases.length) return res.status(404).send("Disease Does Not exist");
    res.send({ diseases, count, page, limit });
    return;
  } catch (error) {
    return next({ error });
  }
};

const getDiseaseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const disease = await Disease.findById(id).select("-__v -createdAt");

    if (!disease) return res.status(400).send("Disease Does Not Exist");
    res.send(disease);
    return;
  } catch (error) {
    return next({ error });
  }
};

const updateDiseaseById = async (req, res, next) => {
  const { id } = req.params;

  const { error, value } = validateDiseaseUpdate(req.body);
  if (error) return res.status(404).send(error.message);
  try {
    const disease = await Disease.findByIdAndUpdate(id, value);
    if (!disease) return res.status(400).send("Disease Does Not Exist");

    return res.send("Disease Updated!!!");
  } catch (error) {
    return next({ error });
  }
};

const deleteDiseaseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const prescriptionDisease = await Prescription.find({
      diseases: id,
    });
    if (prescriptionDisease)
      return res.status(400).send("Disease available in prescription");
    const disease = await Disease.findByIdAndDelete(id);
    if (!disease) return res.status(400).send("Disease Does Not Exist");
    res.send("Disease Deleted Successfully!!!");
    return;
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  addDisease,
  getDiseases,
  getDiseaseById,
  updateDiseaseById,
  deleteDiseaseById,
};
