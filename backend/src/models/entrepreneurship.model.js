import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    fileName: { type: String, default: '' }
  },
  { _id: false }
);

const entrepreneurshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    amountRequested: { type: Number, required: true },
    documents: { type: [fileSchema], default: [] },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
    coordinatorStatus: { type: String, default: 'Submitted' },
    deanStatus: { type: String, default: 'Pending' },
    fundStatus: { type: String, default: 'Not Released' },
    timeline: [{ type: String, required: true }]
  },
  { timestamps: true }
);

export const EntrepreneurshipApplication = mongoose.model('EntrepreneurshipApplication', entrepreneurshipSchema);
