import mongoose from "mongoose";
import grantConnection from "../lib/dbGrantsConnect.js";

const DescriptionItemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true ,default: "N"},
    content: { type: String,required:true,trim:true,default: "N"},
    items: [String], // for list-type descriptions
  },
  { _id: false }
);


const GrantSchema = new mongoose.Schema(
  {
      Program_Name:{
        type:String,
        required: true,
        trim: true,
        default: "N",
      },
       Funder: {
        type: String,
        required: true,
        trim: true,
        default: "N",
      },
      Description: {
        type: [DescriptionItemSchema],
        required: true,
        default: [],
      },
     Max_Amount:{
       type:String,
       required: true,
       trim: true,
       default: "N",
     },
     Max_Percent_Eligible_Costs:{
        type:String,
        required: true,
        trim: true,
        default: "N",
     },
     Sectors:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Region:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Applicant_Type:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Deadline:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Funding_Type:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
    Funding_Purpose:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Funds_Objectives:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Eligibility_Criteria:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },
     Link:{
      type:String,
      required: true,
      trim: true,
      default: "N",
     },

    
  },
  { timestamps: true }
);

// export const Grants = mongoose.model("Grants", GrantSchema);
export const Grants = grantConnection.model("Grants", GrantSchema);

[

  {},
  {},
  {},
  

]