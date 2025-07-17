const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    website: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    createdBy: { type: String, required: true },

    // ✅ Added status field for approval workflow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// ✅ Optional: Create text index for better search functionality
companySchema.index({ companyName: "text" });

module.exports = mongoose.model("Company", companySchema);
