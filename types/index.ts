export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  company: string;
  phone?: string;
  role: "admin" | "client";
  subscription: "basic" | "professional" | "enterprise";
  createdAt: Date;
  avatarUrl?: string;
}

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory =
  | "hardware"
  | "software"
  | "network"
  | "security"
  | "cloud"
  | "other";

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
  pricing?: string;
  popular?: boolean;
}

export interface DashboardStats {
  openTickets: number;
  activeServices: number;
  resolvedThisMonth: number;
}
