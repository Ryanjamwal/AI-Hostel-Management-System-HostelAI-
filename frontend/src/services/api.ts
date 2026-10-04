const API_BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Pre-seeded Mock Data for Standalone / Offline Resilience
const mockStudents: StudentApiItem[] = [
  { id: 1, studentCode: 'STU001', fullName: 'Aarav Sharma', email: 'aarav@hostelai.com', department: 'Computer Science', yearOfStudy: 3, phoneNumber: '+91 98765 43210', emergencyContact: '+91 98765 00000', medicalInfo: 'None' },
  { id: 2, studentCode: 'STU002', fullName: 'Ananya Iyer', email: 'ananya@hostelai.com', department: 'Electrical Eng', yearOfStudy: 2, phoneNumber: '+91 98765 43211', emergencyContact: '+91 98765 00001', medicalInfo: 'Asthma' },
  { id: 3, studentCode: 'STU003', fullName: 'Rohan Mehta', email: 'rohan@hostelai.com', department: 'Mechanical Eng', yearOfStudy: 4, phoneNumber: '+91 98765 43212', emergencyContact: '+91 98765 00002', medicalInfo: 'None' },
  { id: 4, studentCode: 'STU004', fullName: 'Priya Verma', email: 'priya@hostelai.com', department: 'Civil Eng', yearOfStudy: 1, phoneNumber: '+91 98765 43213', emergencyContact: '+91 98765 00003', medicalInfo: 'Nut Allergy' },
  { id: 5, studentCode: 'STU005', fullName: 'Vikram Singh', email: 'vikram@hostelai.com', department: 'Information Tech', yearOfStudy: 3, phoneNumber: '+91 98765 43214', emergencyContact: '+91 98765 00004', medicalInfo: 'None' },
];

const mockRooms: RoomApiItem[] = [
  { id: 1, roomNumber: '101', floor: 1, capacity: 2, roomType: 'Double Deluxe', status: 'Occupied', occupiedBeds: 2 },
  { id: 2, roomNumber: '102', floor: 1, capacity: 2, roomType: 'Double Standard', status: 'Occupied', occupiedBeds: 2 },
  { id: 3, roomNumber: '103', floor: 1, capacity: 2, roomType: 'Double Standard', status: 'Available', occupiedBeds: 0 },
  { id: 4, roomNumber: '104', floor: 1, capacity: 2, roomType: 'Double Standard', status: 'Maintenance', occupiedBeds: 1 },
  { id: 5, roomNumber: '201', floor: 2, capacity: 2, roomType: 'Single Premium', status: 'Occupied', occupiedBeds: 1 },
  { id: 6, roomNumber: '204', floor: 2, capacity: 2, roomType: 'Double Standard', status: 'Emergency', occupiedBeds: 2 },
];

const mockComplaints: ComplaintApiItem[] = [
  { id: 1, studentId: 1, studentCode: 'STU001', category: 'Plumbing', description: 'Water leak under sink in Room 104', priority: 'High', status: 'In Progress', assignedTo: 'Plumbing Team', createdAt: '2026-08-09' },
  { id: 2, studentId: 2, studentCode: 'STU002', category: 'Electrical', description: 'AC unit making unusual vibration noise', priority: 'High', status: 'Open', assignedTo: 'HVAC Team', createdAt: '2026-08-10' },
  { id: 3, studentId: 3, studentCode: 'STU003', category: 'Wi-Fi / IT', description: 'Slow internet connectivity on Floor 2', priority: 'Medium', status: 'Resolved', assignedTo: 'Network Staff', createdAt: '2026-08-08' },
];

const mockPayments: PaymentApiItem[] = [
  { id: 1, studentCode: 'STU001', amount: 45000, type: 'Hostel Accommodation Fee', status: 'Paid', paymentDate: '2026-08-01', referenceNumber: 'TXN-984210' },
  { id: 2, studentCode: 'STU002', amount: 18000, type: 'Mess Meal Quarterly Fee', status: 'Paid', paymentDate: '2026-08-03', referenceNumber: 'TXN-984211' },
  { id: 3, studentCode: 'STU003', amount: 45000, type: 'Hostel Accommodation Fee', status: 'Pending', paymentDate: '2026-08-10', referenceNumber: 'TXN-984212' },
];

const mockVisitors: VisitorApiItem[] = [
  { id: 1, studentCode: 'STU001', visitorName: 'Ramesh Sharma', visitorPhone: '+91 98111 22233', checkInTime: '10:30 AM', checkOutTime: '12:00 PM', approved: true, purpose: 'Parent Visit' },
  { id: 2, studentCode: 'STU002', visitorName: 'Sunita Iyer', visitorPhone: '+91 98111 22234', checkInTime: '02:15 PM', checkOutTime: null, approved: true, purpose: 'Book Delivery' },
];

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errJson = await response.json();
        errorMessage = errJson.error || errJson.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return {} as T;
  } catch (err: any) {
    // Handling GET & POST fallback in standalone mode or backend error
    if (endpoint === '/dashboard') {
      return {
        hostelName: 'HostelAI Central Campus',
        occupancy: 91,
        occupiedRooms: 182,
        totalRooms: 200,
        complaints: mockComplaints.length,
        aiAlerts: 3,
        attendanceRate: 98.4,
        pendingApprovals: 4,
        monthlyRevenue: '₹18,40,000',
        nextMaintenance: '2026-08-14',
      } as unknown as T;
    }
    if (endpoint === '/students') return mockStudents as unknown as T;
    if (endpoint === '/rooms') return mockRooms as unknown as T;

    if (endpoint === '/complaints') {
      if (options?.method === 'POST') {
        const payload: CreateComplaintPayload = JSON.parse(options.body as string);
        const newComplaint: ComplaintApiItem = {
          id: mockComplaints.length + 1,
          studentId: 1,
          studentCode: payload.studentCode || 'STU001',
          category: payload.category || 'General',
          description: payload.description || 'Issue reported',
          priority: payload.priority || 'Medium',
          status: payload.status || 'Open',
          assignedTo: payload.assignedTo || 'Maintenance Team',
          createdAt: new Date().toISOString().substring(0, 10),
        };
        mockComplaints.unshift(newComplaint);
        return newComplaint as unknown as T;
      }
      return mockComplaints as unknown as T;
    }

    if (endpoint.startsWith('/complaints/') && options?.method === 'PUT') {
      const id = parseInt(endpoint.replace('/complaints/', ''), 10);
      const payload = JSON.parse(options.body as string);
      const found = mockComplaints.find(c => c.id === id);
      if (found) {
        found.status = payload.status || found.status;
        return found as unknown as T;
      }
    }

    if (endpoint === '/payments') return mockPayments as unknown as T;
    if (endpoint === '/visitors') return mockVisitors as unknown as T;

    throw err;
  }
}

export interface DashboardMetrics {
  hostelName: string;
  occupancy: number;
  occupiedRooms: number;
  totalRooms: number;
  complaints: number;
  aiAlerts: number;
  attendanceRate: number;
  pendingApprovals: number;
  monthlyRevenue: string;
  nextMaintenance: string;
}

export interface StudentApiItem {
  id: number;
  studentCode: string;
  department: string;
  yearOfStudy: number;
  phoneNumber: string;
  emergencyContact: string;
  medicalInfo: string;
  fullName: string;
  email: string;
}

export interface CreateStudentPayload {
  fullName: string;
  email: string;
  studentCode: string;
  department: string;
  yearOfStudy: number;
  phoneNumber: string;
  emergencyContact: string;
  medicalInfo: string;
}

export interface RoomApiItem {
  id: number;
  roomNumber: string;
  floor: number;
  capacity: number;
  roomType: string;
  status: string;
  occupiedBeds: number;
}

export interface CreateRoomPayload {
  roomNumber: string;
  floor: number;
  capacity: number;
  roomType: string;
  status: string;
}

export interface ComplaintApiItem {
  id: number;
  studentId: number;
  studentCode: string;
  category: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
  createdAt: string;
}

export interface CreateComplaintPayload {
  studentCode: string;
  category: string;
  description: string;
  priority: string;
  status?: string;
  assignedTo: string;
}

export interface PaymentApiItem {
  id: number;
  studentCode: string;
  amount: number;
  type: string;
  status: string;
  paymentDate: string;
  referenceNumber: string;
}

export interface CreatePaymentPayload {
  studentCode: string;
  amount: number;
  type: string;
  status: string;
  paymentDate: string;
  referenceNumber: string;
}

export interface VisitorApiItem {
  id: number;
  studentCode: string;
  visitorName: string;
  visitorPhone: string;
  checkInTime: string;
  checkOutTime: string | null;
  approved: boolean;
  purpose: string;
}

export interface CreateVisitorPayload {
  studentCode: string;
  visitorName: string;
  visitorPhone: string;
  checkInTime: string;
  checkOutTime?: string;
  approved: boolean;
  purpose: string;
}

export const api = {
  getDashboard: () => request<DashboardMetrics>('/dashboard'),

  // Students
  getStudents: () => request<StudentApiItem[]>('/students'),
  createStudent: (data: CreateStudentPayload) =>
    request<StudentApiItem>('/students', { method: 'POST', body: JSON.stringify(data) }),
  deleteStudent: (id: number) => request<void>(`/students/${id}`, { method: 'DELETE' }),

  // Rooms
  getRooms: () => request<RoomApiItem[]>('/rooms'),
  createRoom: (data: CreateRoomPayload) =>
    request<RoomApiItem>('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  deleteRoom: (id: number) => request<void>(`/rooms/${id}`, { method: 'DELETE' }),

  // Complaints
  getComplaints: () => request<ComplaintApiItem[]>('/complaints'),
  createComplaint: (data: CreateComplaintPayload) =>
    request<ComplaintApiItem>('/complaints', {
      method: 'POST',
      body: JSON.stringify({ status: 'Open', ...data }),
    }),
  updateComplaintStatus: (id: number, status: string) =>
    request<ComplaintApiItem>(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Payments
  getPayments: () => request<PaymentApiItem[]>('/payments'),
  createPayment: (data: CreatePaymentPayload) =>
    request<PaymentApiItem>('/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Visitors
  getVisitors: () => request<VisitorApiItem[]>('/visitors'),
  createVisitor: (data: CreateVisitorPayload) =>
    request<VisitorApiItem>('/visitors', { method: 'POST', body: JSON.stringify(data) }),
};
