import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El titulo es obligatorio.'],
    },
    description: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

CampaignSchema.index({ isActive: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

export default Campaign;
