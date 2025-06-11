import React, { useState } from "react";
import Axios from "../lib/axios.js";

const AddGrantForm = () => {
  const [grants, setGrants] = useState([
    {
      OpportunityID: "",
      OpportunityTitle: "",
      OpportunityNumber: "",
      OpportunityCategory: "",
      FundingInstrumentType: [],
      CategoryOfFundingActivity: [],
      CategoryExplanation: "",
      CFDANumbers: "",
      EligibleApplicants: "",
      AdditionalInformationOnEligibility: "",
      AgencyCode: "",
      AgencyName: "",
      PostDate: "",
      CloseDate: "",
      CloseDateExplanation: "",
      LastUpdatedDate: "",
      AwardCeiling: "",
      AwardFloor: "",
      EstimatedTotalProgramFunding: "",
      ExpectedNumberOfAwards: "",
      Description: "",
      Version: "1.0",
      CostSharingOrMatchingRequirement: "",
      ArchiveDate: "",
      AdditionalInformationURL: "",
      AdditionalInformationText: "",
      GrantorContactEmail: "",
      GrantorContactEmailDescription: "",
      GrantorContactText: ""
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newGrants = [...grants];
    
    // Handle array fields
    if (name === "FundingInstrumentType" || name === "CategoryOfFundingActivity") {
      newGrants[index][name] = value.split(',').map(item => item.trim());
    } else {
      newGrants[index][name] = value;
    }
    
    setGrants(newGrants);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await Axios.patch(
        "/grants/add-new-grants",
        { OpportunitySynopsisDetail_1_0: grants },
        { withCredentials: true }
      );
      
      alert(response.data.message);
      // Reset form
      setGrants([{
        OpportunityID: "",
        OpportunityTitle: "",
        OpportunityNumber: "",
        // ... reset all fields
      }]);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Grants</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {grants.map((grant, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Information */}
              <input
                type="number"
                name="OpportunityID"
                placeholder="Opportunity ID"
                value={grant.OpportunityID}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="OpportunityTitle"
                placeholder="Opportunity Title"
                value={grant.OpportunityTitle}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="OpportunityNumber"
                placeholder="Opportunity Number"
                value={grant.OpportunityNumber}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
                required
              />

              {/* Detailed Information */}
              <input
                type="text"
                name="OpportunityCategory"
                placeholder="Opportunity Category"
                value={grant.OpportunityCategory}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="FundingInstrumentType"
                placeholder="Funding Instrument Type (comma separated)"
                value={grant.FundingInstrumentType.join(', ')}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="CategoryOfFundingActivity"
                placeholder="Funding Activity Category (comma separated)"
                value={grant.CategoryOfFundingActivity.join(', ')}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />

              {/* Agency and Contact Information */}
              <input
                type="text"
                name="AgencyCode"
                placeholder="Agency Code"
                value={grant.AgencyCode}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="AgencyName"
                placeholder="Agency Name"
                value={grant.AgencyName}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
              <input
                type="email"
                name="GrantorContactEmail"
                placeholder="Grantor Contact Email"
                value={grant.GrantorContactEmail}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />

              {/* Dates */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Post Date</label>
                <input
                  type="date"
                  name="PostDate"
                  value={grant.PostDate}
                  onChange={(e) => handleInputChange(index, e)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Close Date</label>
                <input
                  type="date"
                  name="CloseDate"
                  value={grant.CloseDate}
                  onChange={(e) => handleInputChange(index, e)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Last Updated Date</label>
                <input
                  type="date"
                  name="LastUpdatedDate"
                  value={grant.LastUpdatedDate}
                  onChange={(e) => handleInputChange(index, e)}
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Funding Details */}
              <input
                type="number"
                name="AwardCeiling"
                placeholder="Award Ceiling"
                value={grant.AwardCeiling}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                name="AwardFloor"
                placeholder="Award Floor"
                value={grant.AwardFloor}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                name="EstimatedTotalProgramFunding"
                placeholder="Estimated Total Program Funding"
                value={grant.EstimatedTotalProgramFunding}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />

              {/* Additional Information */}
              <textarea
                name="Description"
                placeholder="Description"
                value={grant.Description}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full md:col-span-3"
                rows="3"
              />
              <input
                type="text"
                name="AdditionalInformationURL"
                placeholder="Additional Information URL"
                value={grant.AdditionalInformationURL}
                onChange={(e) => handleInputChange(index, e)}
                className="border p-2 rounded w-full"
              />
            </div>
            
            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded shadow ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 text-white'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Grant'}
              </button>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default AddGrantForm;