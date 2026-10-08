import mongoose from "mongoose";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const isHttpUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: "Status must be Applied, Interview, Offer, or Rejected"
      },
      default: "Applied"
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    jobLink: {
      type: String,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: "Job link must be a valid HTTP or HTTPS URL"
      }
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export { STATUSES };
export default mongoose.model("Application", applicationSchema);
