import mongoose from "mongoose";
import Application, { STATUSES } from "../models/Application.js";

const UPDATE_FIELDS = [
  "company",
  "role",
  "status",
  "appliedDate",
  "jobLink",
  "notes"
];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateId = (id) => {
  if (!isValidId(id)) {
    throw createError("Invalid application ID", 400);
  }
};

const validateBody = (body) => {
  if (!body || Object.keys(body).length === 0) {
    throw createError("Request body is required", 400);
  }
};

const getAllowedUpdates = (body) => {
  const invalidFields = Object.keys(body).filter(
    (field) => !UPDATE_FIELDS.includes(field)
  );

  if (invalidFields.length > 0) {
    throw createError(`Cannot update fields: ${invalidFields.join(", ")}`, 400);
  }

  return UPDATE_FIELDS.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }

    return updates;
  }, {});
};

const buildListFilter = (query) => {
  const filter = {};
  const { search, company, role, status } = query;

  if (status) {
    if (!STATUSES.includes(status)) {
      throw createError("Invalid status filter", 400);
    }

    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } }
    ];
  }

  if (company) {
    filter.company = { $regex: company, $options: "i" };
  }

  if (role) {
    filter.role = { $regex: role, $options: "i" };
  }

  return filter;
};

const handleAsync = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getApplications = handleAsync(async (req, res) => {
  const filter = buildListFilter(req.query);
  const applications = await Application.find(filter).sort({ appliedDate: -1 });

  res.status(200).json(applications);
});

const getApplicationById = handleAsync(async (req, res) => {
  validateId(req.params.id);

  const application = await Application.findById(req.params.id);

  if (!application) {
    throw createError("Application not found", 404);
  }

  res.status(200).json(application);
});

const createApplication = handleAsync(async (req, res) => {
  validateBody(req.body);

  const application = await Application.create(req.body);

  res.status(201).json(application);
});

const updateApplication = handleAsync(async (req, res) => {
  validateId(req.params.id);
  validateBody(req.body);

  const updates = getAllowedUpdates(req.body);

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!application) {
    throw createError("Application not found", 404);
  }

  res.status(200).json(application);
});

const deleteApplication = handleAsync(async (req, res) => {
  validateId(req.params.id);

  const application = await Application.findByIdAndDelete(req.params.id);

  if (!application) {
    throw createError("Application not found", 404);
  }

  res.status(200).json({ message: "Application deleted successfully" });
});

export {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication
};
