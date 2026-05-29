import mongoose, { Document, Schema, Types } from 'mongoose';

export const COMPLAINT_CATEGORIES = [
  'pothole',
  'garbage',
  'broken_streetlight',
  'water_leakage',
  'sewage',
] as const;

export const COMPLAINT_STATUSES = [
  'submitted',
  'in_review',
  'in_progress',
  'resolved',
  'rejected',
] as const;

export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number];
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export interface IStatusHistoryEntry {
  status: ComplaintStatus;
  note?: string;
  timestamp: Date;
}

export interface IComplaint extends Document {
  userId: Types.ObjectId;
  category: ComplaintCategory;
  description: string;
  photo: string;
  latitude: number;
  longitude: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  address?: string;
  accuracy?: number;
  status: ComplaintStatus;
  statusHistory: IStatusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const statusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    status: { type: String, enum: COMPLAINT_STATUSES, required: true },
    note: { type: String, maxlength: 500 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new Schema<IComplaint>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: COMPLAINT_CATEGORIES, required: true, index: true },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
    photo: { type: String, required: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, trim: true, maxlength: 500 },
    accuracy: { type: Number },
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: 'submitted',
      index: true,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true }
);

complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ createdAt: -1 });

complaintSchema.pre('validate', function (next) {
  if (this.latitude != null && this.longitude != null) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude],
    };
  }
  next();
});

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);
