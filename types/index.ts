export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'authority' | 'admin';
  email_verified_at: string | null;
  created_at: string;
}

export interface Report {
  id: number;
  user_id: number;
  image_url: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  status: 'pending' | 'in_progress' | 'resolved';
  is_anonymous: boolean;
  created_at: string;
  deleted_at: string | null;
  user?: User;
}

export interface Comment {
  id: number;
  user_id: number;
  report_id: number;
  message: string;
  is_official: boolean;
  created_at: string;
  user?: User;
}

export interface DashboardStats {
  total_users: number;
  total_reports: number;
  pending: number;
  in_progress: number;
  resolved: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}