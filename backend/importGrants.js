import fs from 'fs';
import { Grants } from './models/grant.model.js'; // which already uses grantConnection

// Read JSON
const rawData = fs.readFileSync('grants.json', 'utf-8');
const data = JSON.parse(rawData);

// Prepare grant documents
const grants = data.map(row => ({
  Program_Name: row.Funder || "N",
  Funder: row.Funder || "N",
  Description: Array.isArray(row.Description) ? row.Description : [],
  Max_Amount: row.Max_Amount || "N",
  Max_Percent_Eligible_Costs: row.Max_Percent_Eligible_Costs || "N",
  Sectors: row.Sectors || "N",
  Region: row.Region || "N",
  Applicant_Type: row.Applicant_Type || "N",
  Deadline: row.Deadline || "N",
  Funding_Type: row.Funding_Type || "N",
  Funding_Purpose: row.Funding_Purpose || "N",
  Funds_Objectives: row.Funds_Objectives || "N",
  Eligibility_Criteria: row.Eligibility_Criteria || "N",
  Link: row.Link || "N",
}));

// Insert grants
(async () => {
  try {
    const result = await Grants.insertMany(grants);
    console.log(`✅ Inserted ${result.length} grants`);
  } catch (err) {
    console.error("❌ Insert failed:", err);
  } finally {
    Grants.db.close(); // closes only this connection
  }
})();
