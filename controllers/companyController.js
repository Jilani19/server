const Company = require("../models/Company");

// Create
exports.createCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    const existing = await Company.findOne({
      companyName: { $regex: `^${companyName}$`, $options: "i" }
    });
    if (existing) return res.status(409).json({ message: "Company already exists" });

    const newCompany = new Company({ ...req.body, status: "pending" }); // default status
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All with Filters + Pagination + Status
exports.getAllCompanies = async (req, res) => {
  try {
    const { search, city, status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) query.companyName = { $regex: search, $options: "i" };
    if (city) query.city = city;
    if (status) query.status = status;

    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(query);

    res.json({
      data: companies,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update
exports.updateCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete
exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// Get Suggestions
exports.getCompanySuggestions = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) return res.json([]);

    const regex = new RegExp(search, "i");
    const companies = await Company.find({ companyName: regex }, { companyName: 1, _id: 0 }).limit(10);

    const names = companies.map((c) => c.companyName);
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Approve Company
exports.approveCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company approved", company: updated });
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
};

// Reject Company
exports.rejectCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company rejected", company: updated });
  } catch (err) {
    res.status(500).json({ error: "Rejection failed" });
  }
};
