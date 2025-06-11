import { model, Schema } from "mongoose";

const UserGrantSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    businessId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Business', 
      required: true,
      index: true 
    },
    grants: {
      type: [{
        programName: { type: String, required: true },
        description: [{
          type: { type: String, enum: ["heading", "paragraph"] },
          content: String,
        }],
        maxAmount: String,
        sectors: { type: [String], default: [] }, 
        region: String,
        fundingType: String,
        deadline: String,
        link: String
      }],
      required: true
    }
  }, 
  { timestamps: true }
);

export const UserGrant = model('UserGrant', UserGrantSchema);