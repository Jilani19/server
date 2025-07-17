// routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

/**
 * @swagger
 * /api/companies/names:
 *   get:
 *     summary: Get matching company names for suggestion
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Partial company name to search
 *     responses:
 *       200:
 *         description: List of matching company names
 */
router.get("/companies/names", async (req, res) => {
  const search = req.query.search || "";
  try {
    const companies = await Company.find({
      companyName: { $regex: search, $options: "i" }
    }).limit(10);
    const names = companies.map((c) => c.companyName);
    res.json(names);
  } catch (err) {
    console.error("Auto-suggest error:", err.message);
    res.status(500).json({ error: "Failed to fetch company names" });
  }
});

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.post("/companies", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: "Failed to create company" });
  }
});

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get a single company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company data
 */
router.get("/companies/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch company" });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 */
router.put("/companies/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCompany)
      return res.status(404).json({ error: "Company not found" });
    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: "Failed to update company" });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 */
router.delete("/companies/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany)
      return res.status(404).json({ error: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete company" });
  }
});

module.exports = router;
