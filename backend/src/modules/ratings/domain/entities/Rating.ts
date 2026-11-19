export interface Rating {
  id: string;
  requestId: string;
  technicianId: string;
  stars: number;
  comment: string | null;
  createdAt: string;
}
