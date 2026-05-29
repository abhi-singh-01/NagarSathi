import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Complaint, ComplaintStatus } from '../models/Complaint';
import { ApiError } from '../utils/ApiError';
import { toComplaintResponse } from '../utils/transform';

function pushStatusHistory(
  complaint: InstanceType<typeof Complaint>,
  status: ComplaintStatus,
  note?: string
) {
  complaint.status = status;
  complaint.statusHistory.push({
    status,
    note,
    timestamp: new Date(),
  });
}

export async function createComplaint(req: AuthRequest, res: Response) {
  if (!req.user) throw ApiError.unauthorized();
  if (!req.file) throw ApiError.badRequest('Photo is required');

  const { category, description, latitude, longitude, address, accuracy } = req.body;

  const complaint = await Complaint.create({
    userId: req.user._id,
    category,
    description,
    photo: req.file.filename,
    latitude,
    longitude,
    address,
    accuracy,
    status: 'submitted',
    statusHistory: [
      {
        status: 'submitted',
        note: 'Complaint received by NagarSathi',
        timestamp: new Date(),
      },
    ],
  });

  res.status(201).json(toComplaintResponse(complaint, req));
}

export async function listComplaints(req: AuthRequest, res: Response) {
  const { status, category, page, limit } = req.query as unknown as {
    status?: string;
    category?: string;
    page: number;
    limit: number;
  };

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json({
    data: complaints.map((c) => toComplaintResponse(c, req)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

/** Flat array for mobile app compatibility */
export async function listComplaintsFlat(req: AuthRequest, res: Response) {
  const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(200);
  res.json(complaints.map((c) => toComplaintResponse(c, req)));
}

export async function listMyComplaints(req: AuthRequest, res: Response) {
  if (!req.user) throw ApiError.unauthorized();

  const complaints = await Complaint.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(complaints.map((c) => toComplaintResponse(c, req)));
}

export async function getNearbyComplaints(req: AuthRequest, res: Response) {
  const { latitude, longitude, radius, limit, category } = req.query as unknown as {
    latitude: number;
    longitude: number;
    radius: number;
    limit: number;
    category?: string;
  };

  const filter: Record<string, unknown> = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: radius,
      },
    },
  };

  if (category) filter.category = category;

  const complaints = await Complaint.find(filter).limit(limit);

  res.json({
    data: complaints.map((c) => toComplaintResponse(c, req)),
    meta: { latitude, longitude, radiusMeters: radius, count: complaints.length },
  });
}

export async function getComplaintById(req: AuthRequest, res: Response) {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw ApiError.notFound('Complaint not found');
  res.json(toComplaintResponse(complaint, req));
}

export async function updateComplaint(req: AuthRequest, res: Response) {
  if (!req.user) throw ApiError.unauthorized();

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw ApiError.notFound('Complaint not found');

  const isOwner = complaint.userId.toString() === req.user._id.toString();
  const { description, address, status, statusNote } = req.body;

  if (description !== undefined) {
    if (!isOwner) throw ApiError.forbidden('Only the owner can edit description');
    complaint.description = description;
  }

  if (address !== undefined) {
    if (!isOwner) throw ApiError.forbidden('Only the owner can edit address');
    complaint.address = address;
  }

  if (status !== undefined) {
    if (complaint.status !== status) {
      pushStatusHistory(complaint, status, statusNote);
    }
  }

  await complaint.save();
  res.json(toComplaintResponse(complaint, req));
}

export async function deleteComplaint(req: AuthRequest, res: Response) {
  if (!req.user) throw ApiError.unauthorized();

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw ApiError.notFound('Complaint not found');

  if (complaint.userId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the owner can delete this complaint');
  }

  await complaint.deleteOne();
  res.json({ message: 'Complaint deleted successfully' });
}
