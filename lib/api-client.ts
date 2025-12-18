import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://0.0.0.0:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Attendee {
  id: string;
  mobile: string;
  name: string;
  email: string;
  organization?: string;
  designation?: string;
  qrCode?: string;
  registrationDate?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
}

export interface AttendeeRegistrationRequest {
  mobile: string;
  name?: string;
  email?: string;
  organization?: string;
  designation?: string;
}

export interface AttendeeResponse {
  success: boolean;
  data?: Attendee;
  message?: string;
}

// API Methods
export const attendeeApi = {
  // Get attendee by mobile number
  getByMobile: async (mobile: string): Promise<Attendee> => {
    const response = await apiClient.get<AttendeeResponse>(`/attendees/mobile/${mobile}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch attendee');
  },

  // Register new attendee
  register: async (data: AttendeeRegistrationRequest): Promise<Attendee> => {
    const response = await apiClient.post<AttendeeResponse>('/attendees/register', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to register attendee');
  },

  // Update attendee details
  update: async (id: string, data: Partial<AttendeeRegistrationRequest>): Promise<Attendee> => {
    const response = await apiClient.put<AttendeeResponse>(`/attendees/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update attendee');
  },

  // Get attendee details (alternative endpoint)
  getById: async (id: string): Promise<Attendee> => {
    const response = await apiClient.get<AttendeeResponse>(`/attendees/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch attendee');
  },

  // Generate QR code for attendee
  generateQRCode: async (attendeeId: string): Promise<string> => {
    const response = await apiClient.post<{ success: boolean; qrCode: string }>(`/attendees/${attendeeId}/qrcode`);
    if (response.data.success) {
      return response.data.qrCode;
    }
    throw new Error('Failed to generate QR code');
  },
};

export default apiClient;

