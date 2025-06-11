import { User } from "../models/auth.model.js";
import { Business } from "../models/business.model.js";
import { validationResult } from 'express-validator';
import mongoose from "mongoose";
import validator from "validator";
import { UserGrant } from "../models/usersGrant.model.js";

export const getBusinessForm = async (req, res) => {
  try {
    const userId = req.params.id; // Get the userId from the route parameter
    console.log("User id is", userId);

    let businessdetails;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      // Fetch forms submitted by the specific user (if userId is valid)
      businessdetails = await Business.find({ user: userId }).populate(
        "user",
        "email"
      ); // Populate user and return the email field

      if (!businessdetails || businessdetails.length === 0) {
        return res
          .status(404)
          .json({ message: "No business forms found for this user." });
      }
    } else {
      // If userId is not provided or is invalid, return an empty response
      return res.status(404).json({ message: "No user found with this id." });
    }

    console.log("business details are", businessdetails);

    return res.status(200).json({ businessdetails });
  } catch (error) {
    console.error("Error fetching business forms:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const fillBusinessForm = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      email,
      firstName,
      lastName,
      companyName,
      website,
      phoneNumber,
      country,
      headquartered,
      additionalIndustries,
      businessType,
      keyBusinessGoals,
      incorporationDate,
      founderDemographics,
      employeeCount,
      annualRevenue,
      industry,
      grantFunding,
      researchDevelopment,
      language,
      payrollSystem,
    } = req.body;

    console.log("Received data:", req.body);
    console.log("Data types:", Object.entries(req.body).map(([k, v]) => [k, typeof v]));

    if (typeof researchDevelopment !== 'boolean') {
      return res.status(400).json({
        message: "researchDevelopment must be a boolean value",
        received: typeof researchDevelopment
      });
    }

    if (typeof grantFunding !== 'boolean') {
      return res.status(400).json({
        message: "grantFunding must be a boolean value",
        received: typeof grantFunding
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate founderDemographics
    if (
      !Array.isArray(founderDemographics) ||
      (founderDemographics.length === 0 && !founderDemographics.includes("None"))
    ) {
      return res.status(400).json({
        message: "Please select at least one founder demographic or 'None of the above'",
      });
    }

    if (founderDemographics.includes("None") && founderDemographics.length > 1) {
      return res.status(400).json({
        message: "Cannot select 'None of the above' with other demographics"
      });
    }

    if (
      !email ||
      !validator.isEmail(email) ||
      !userId ||
      !companyName ||
      !phoneNumber ||
      !country ||
      !headquartered ||
      !businessType ||
      !Array.isArray(keyBusinessGoals) ||
      !keyBusinessGoals.length ||
      !incorporationDate ||
      !Array.isArray(founderDemographics) ||
      !founderDemographics.length ||
      employeeCount === undefined ||
      annualRevenue === undefined ||
      !industry ||
      grantFunding === undefined ||
      researchDevelopment === undefined ||
      !language
    ) {
      return res.status(400).json({
        message: "All required fields must be filled.",
        missingFields: {
          email: !email,
          validEmail: !validator.isEmail(email),
          userId: !userId,
          companyName: !companyName,
          phoneNumber: !phoneNumber,
          country: !country,
          headquartered: !headquartered,
          businessType: !businessType,
          keyBusinessGoals: !Array.isArray(keyBusinessGoals) || !keyBusinessGoals.length,
          incorporationDate: !incorporationDate,
          founderDemographics: !Array.isArray(founderDemographics) || !founderDemographics.length,
          employeeCount: employeeCount === undefined,
          annualRevenue: annualRevenue === undefined,
          industry: !industry,
          grantFunding: grantFunding === undefined,
          researchDevelopment: researchDevelopment === undefined,
          language: !language
        }
      });
    }
    const alreadyAvailable = await Business.findOne({ email: email });

    if (alreadyAvailable) {
      return res.status(404).json({ message: "Email is already used." });
    }
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    console.log("User found:", email);

    // Create new business form entry
    const newBusiness = await new Business({
      user: userId,
      email,
      companyName,
      firstName,
      lastName,
      additionalIndustries,
      website,
      phoneNumber,
      country,
      headquartered,
      businessType,
      keyBusinessGoals,
      incorporationDate,
      founderDemographics,
      employeeCount: Number(employeeCount),
      annualRevenue: Number(annualRevenue),
      industry,
      grantFunding,
      researchDevelopment,
      language,
      payrollSystem,
    }).save();

    user.business = true; // Assuming the User model has a 'business' field
    await user.save();

    return res
      .status(201)
      .json({
        message: "Business form submitted successfully.",
        business: newBusiness,
      });
  } catch (error) {
    console.error("Detailed submission error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const editBusinessForm = async (req, res) => {
  try {
    const businessId = req.params.id;
    const userId =req.userId
    const {
      email,
      firstName,
      lastName,
      companyName,
      website,
      phoneNumber,
      country,
      headquartered,
      businessType,
      keyBusinessGoals,
      additionalIndustries,
      incorporationDate,
      founderDemographics,
      employeeCount,
      annualRevenue,
      industry,
      summary,
      grantFunding,
      researchDevelopment,
      language,
      payrollSystem,
    } = req.body;

    // Validate businessId
    if (!businessId || !mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business form ID." });
    }

    // Validate required fields
    if (
      !email ||
      !companyName ||
      !phoneNumber ||
      !country ||
      !headquartered ||
      !businessType ||
      !Array.isArray(keyBusinessGoals) ||
      !keyBusinessGoals.length ||
      !incorporationDate ||
      !Array.isArray(founderDemographics) ||
      !founderDemographics.length ||
      employeeCount === undefined ||
      annualRevenue === undefined ||
      !industry ||
      grantFunding === undefined ||
      researchDevelopment === undefined ||
      !language
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Find the business form by ID
    const alreadyAvailable = await Business.findOne({ email: email });

    if (alreadyAvailable&&alreadyAvailable._id.toString() !== businessId) {
      return res.status(404).json({ message: "Email is already used." });
    }
    const businessForm = await Business.findById(businessId);

    if (!businessForm) {
      return res.status(404).json({ message: "Business form not found." });
    }

    // Update the business form details
    businessForm.email = email;
    businessForm.companyName = companyName;
    businessForm.firstName = firstName;
    businessForm.lastName = lastName;
    businessForm.website = website;
    businessForm.phoneNumber = phoneNumber;
    businessForm.country = country;
    businessForm.headquartered = headquartered;
    businessForm.additionalIndustries = additionalIndustries;
    businessForm.businessType = businessType;
    businessForm.keyBusinessGoals = keyBusinessGoals;
    businessForm.incorporationDate = incorporationDate;
    businessForm.founderDemographics = founderDemographics;
    businessForm.employeeCount = employeeCount;
    businessForm.summary = summary||"not provided";
    businessForm.annualRevenue = annualRevenue;
    businessForm.industry = industry;
    businessForm.grantFunding = grantFunding;
    businessForm.researchDevelopment = researchDevelopment;
    businessForm.language = language;
    businessForm.payrollSystem = payrollSystem;

    // Save the updated business form
    const updatedBusinessForm = await businessForm.save();
    await UserGrant.deleteMany({userId:userId})
    return res.status(200).json({
      message: "Business form updated successfully.",
      business: updatedBusinessForm,
    });
  } catch (error) {
    console.error("Error editing business form:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
