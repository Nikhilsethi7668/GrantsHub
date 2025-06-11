import { Grants } from "../models/grant.model.js";
import axios from "axios";
import { Business } from "../models/business.model.js";
import { UserGrant } from "../models/usersGrant.model.js";


// added by shohail - 15/05/202


export const getGrants = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });
  }

  try {

     const cachedGrants = await UserGrant.findOne({ userId: userId })
      .populate('businessId')
      .sort({ createdAt: -1 })
      .limit(1);

    if (cachedGrants) {
         res.status(200).json({ success: true, data:{userId,businessId:cachedGrants.businessId,rawResponse:{grants:cachedGrants?.grants,totalGrants:cachedGrants?.grants?.length}} });

      return
    }

    const businessDetails = await Business.findOne({ user: userId });
    if (!businessDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Business details not found." });
    }

    // Define currentDate before using it in the prompt
    const currentDate = new Date().toISOString().split('T')[0];

    const prompt = `
BUSINESS PROFILE INPUT:
${JSON.stringify(businessDetails)}

ANALYZE BUSINESS PROFILE:
1. Company Name Analysis
- Use the company name "${businessDetails.businessName}" to:
  * Infer primary business activities
  * Identify potential industry sectors beyond stated NAICS
  * Determine if specialized grants might apply
  * Cross-reference with stated industry "${businessDetails.industry}"
  * Consider both explicit and implicit business activities

2. Industry Classification
- Primary Industry: ${businessDetails.industry}
- Additional sectors to consider based on company name analysis
- Include grants that match either:
  * Stated industry classification
  * Industry inferred from company name
  * Related or supporting industries

OBJECTIVE:
Find Canadian grants only — that are currently open and matched with the business profile. Use every data point for intelligent filtering. Enforce strict regional and eligibility alignment. This prompt is intended to power real-time Canadian grant search via Perplexity AI.

============================

GRANTS MUST BE CANADIAN
============================

Include only grants offered by:

Government of Canada (federal programs via canada.ca or departmental portals)

Provincial and territorial governments (e.g., BC Gov, Ontario.ca)

Canadian municipal programs (only if available in the business's province)

Registered Canadian foundations, economic development agencies, or Crown corporations

DO NOT include:

Any international grant programs (e.g., US, EU, UK, UN, etc.)

Global NGO or UN-backed grants

Startup accelerators or venture programs based outside of Canada

============================
2. ACTIVE GRANTS ONLY — HARD EXCLUSION
STRICTLY EXCLUDE any grant that is:

Finished, expired, or closed to new applications

Paused, suspended, or not currently accepting applications

Invitation-only, academic-only, research-only, unverifiable, or with dead links

INCLUDE ONLY grants that are:

Actively open for applications as of today (${currentDate})

Application deadlines must fall between June 6, 2025, and June 6, 2026, or be ongoing

Flag any grants closing within 30 days

Mark multi-year or renewable funding programs clearly

VALIDATE each grant's status against official, up-to-date Canadian government or foundation sources

EXAMPLES OF HARD EXCLUSION: Do NOT include the Canada Digital Adoption Program (CDAP) or any other grant that is finished, paused, or not accepting new applications.

============================
3. ELIGIBILITY MATCHING CRITERIA
A. Business Type

Must match exactly (e.g., Private Corporation, Nonprofit, Charity)

B. Province of Registration

Only show grants from the province where the business is registered

Canada-wide grants are allowed only if explicitly available in that province

If registered in British Columbia (BC), MUST INCLUDE these specific grants:
1. B.C. Employer Training Grant (ETG)
   - Up to $300,000 per fiscal year
   - 80% of training costs covered (up to $10,000 per employee)
   - For skills training and workforce development
   - Link: https://www.workbc.ca/find-loans-and-grants/industry-and-employers/bc-employer-training-grant

2. Student Work Placement Program (SWPP)
   - Federal program available in BC
   - Wage subsidies for student placements
   - For post-secondary student work experience
   - Link: https://www.canada.ca/en/employment-social-development/programs/student-work-placement-program.html

For other provinces, show only:
- Province-specific grants
- Canada-wide grants that are clearly eligible in that province

DO NOT show grants from other provinces

C. Sectors

Must align with:
- Stated industry/NAICS sectors: ${businessDetails.industry}
- Industry inferred from company name: "${businessDetails.businessName}"
- Focus on summary also: "${businessDetails?.summary}"
- Related or supporting industries identified from name analysis

Examples of sector matching:
- Manufacturing, Social Services, Arts, Food Services, Media, etc.
- Tech/Digital if name suggests technology focus
- Creative/Arts if name suggests creative business
- Service-based if name indicates service provision
- Retail/Commerce if name suggests retail operations

D. Ownership Identity

Only apply identity-based grants if the funder requires it (e.g., visible minority, LGBTQ2+, women-led)

E. Location Type

Respect rural/urban targeting where specified

F. Business Size & Revenue

Ensure grant fits based on:

Number of employees

Annual revenue

Age of the business

G. Purpose Fit

Only include grants that support:

Program delivery

Expansion or scaling

Innovation or content production

Commercialization or export

Health, wellness, or food access (if noted)

H. Funding Range

Grant value must be between $5,000 and $500,000 CAD

Prioritize: $10K, $25K, or $100K

Specify matching fund requirements if applicable

============================
4. STRICT JSON OUTPUT FORMAT
Return up to 10 verified, high-fit grants in the following format:

[
{
"programName": "Grant Name",
"description": [
{ "type": "heading", "content": "Funder Name or Program Stream" },
{ "type": "paragraph", "content": "20–40 word summary of purpose, population served (if any), and eligibility highlights." }
],
"maxAmount": "$X",
"sectors": "e.g., Manufacturing, Health, Nonprofit",
"region": "e.g., British Columbia or Canada-wide eligible in BC",
"fundingType": "Government/Foundation/Private",
"deadline": "YYYY-MM-DD or Ongoing",
"link": "https://application.portal.link"
}
]

============================
5. QUALITY & ACCURACY CHECKS
All grants must be verified as Canadian and active

At least 2 entries should offer multi-year funding if applicable

Confirm if similar businesses have received the grant

No expired, unverifiable, or irrelevant entries

Ensure structure is PDF-ready and clean

============================
6. CRITICAL RESPONSE RULES
Return JSON only — no markdown, no commentary, no backticks

Match 100% on province of registration

Absolutely exclude all international or globally sourced grants

Use only Canadian public and foundation sources

Use intelligent filtering logic across structure, sector, ownership, geography, and revenue

Do not assume eligibility — only include grants with direct fit to profile

→ Return only the JSON array. No headings, explanations, or formatting.`;

    const payload = {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant and very deep researcher. *Canadian grants only*, **currently active, and * grant opportunities **Return ONLY valid JSON, no extra text.**"
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 4096,
      temperature: 0.6
    };

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.PPLX_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let grants = [];
    let raw = "";
    try {
      raw = (await response.data.choices[0]?.message?.content) || "";

      if (raw && raw.trim() !== "") {
        grants = JSON.parse(raw);
      }
    } catch (error) {
      if (raw.trim() === "") console.error("no data found");

      console.error("Error parsing grant data:", error.message);
      grants = [];
    }

    const newGrant = await UserGrant.create({
      userId,
      businessId: businessDetails._id,
      grants
    });

    res.status(200).json({ 
      success: true, 
      data: { 
        ...newGrant,
        rawResponse: {
          grants: newGrant?.grants,
          totalGrants: newGrant?.grants?.length
        }
      } 
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching grants",
      error: error.message
    });
  }
};