import mongoose from "mongoose";

const saveGrantsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
     OpportunitySynopsisDetail_1_0: [
        {
          OpportunityID: { type: Number, required: true },
          OpportunityTitle: { type: String, required: true },
          OpportunityNumber: { type: String, required: true },
          OpportunityCategory: { type: String },
          FundingInstrumentType: { type: [String], default: undefined },
          CategoryOfFundingActivity: { type: [String], default: undefined },
          CategoryExplanation: { type: String },
          CFDANumbers: mongoose.Schema.Types.Mixed,
          EligibleApplicants: mongoose.Schema.Types.Mixed,
          AdditionalInformationOnEligibility: { type: String },
          AgencyCode: { type: String },
          AgencyName: { type: String },
          PostDate: { type: Date },
          CloseDate: { type: Date },
          CloseDateExplanation: { type: String },
          LastUpdatedDate: { type: Date },
          AwardCeiling: { type: Number, default: 0 },
          AwardFloor: { type: Number, default: 0 },
          EstimatedTotalProgramFunding: { type: Number },
          ExpectedNumberOfAwards: { type: Number },
          Description: { type: String },
          Version: { type: String },
          CostSharingOrMatchingRequirement: { type: String },
          ArchiveDate: { type: Date },
          AdditionalInformationURL: { type: String },
          AdditionalInformationText: { type: String },
          GrantorContactEmail: { type: String },
          GrantorContactEmailDescription: { type: String },
          GrantorContactText: { type: String },
        },
      ],

})

export const saveGrant = mongoose.model("saveGrant", saveGrantsSchema);

