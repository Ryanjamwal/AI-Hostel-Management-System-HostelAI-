// Mock analytics data - replace with real API calls

export interface OccupancyData {
  month: string;
  occupancy: number;
  capacity: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

export interface ComplaintData {
  category: string;
  count: number;
}

export interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export interface RoomStatusData {
  status: string;
  count: number;
}

export const getOccupancyData = (): OccupancyData[] => [
  { month: 'Jan', occupancy: 180, capacity: 200 },
  { month: 'Feb', occupancy: 185, capacity: 200 },
  { month: 'Mar', occupancy: 192, capacity: 200 },
  { month: 'Apr', occupancy: 188, capacity: 200 },
  { month: 'May', occupancy: 195, capacity: 200 },
  { month: 'Jun', occupancy: 198, capacity: 200 },
  { month: 'Jul', occupancy: 200, capacity: 200 },
  { month: 'Aug', occupancy: 197, capacity: 200 },
];

export const getRevenueData = (): RevenueData[] => [
  { month: 'Jan', revenue: 18000, target: 20000 },
  { month: 'Feb', revenue: 21000, target: 20000 },
  { month: 'Mar', revenue: 19500, target: 20000 },
  { month: 'Apr', revenue: 22000, target: 20000 },
  { month: 'May', revenue: 25000, target: 20000 },
  { month: 'Jun', revenue: 23000, target: 20000 },
  { month: 'Jul', revenue: 26000, target: 20000 },
  { month: 'Aug', revenue: 24500, target: 20000 },
];

export const getComplaintData = (): ComplaintData[] => [
  { category: 'Maintenance', count: 45 },
  { category: 'Cleaning', count: 28 },
  { category: 'Noise', count: 32 },
  { category: 'Water', count: 15 },
  { category: 'Electrical', count: 22 },
  { category: 'Others', count: 18 },
];

export const getAttendanceData = (): AttendanceData[] => [
  { date: 'Mon', present: 185, absent: 10, late: 5 },
  { date: 'Tue', present: 188, absent: 8, late: 4 },
  { date: 'Wed', present: 190, absent: 6, late: 4 },
  { date: 'Thu', present: 192, absent: 5, late: 3 },
  { date: 'Fri', present: 195, absent: 3, late: 2 },
  { date: 'Sat', present: 140, absent: 50, late: 10 },
  { date: 'Sun', present: 120, absent: 70, late: 10 },
];

export const getRoomStatusData = (): RoomStatusData[] => [
  { status: 'Occupied', count: 197 },
  { status: 'Available', count: 2 },
  { status: 'Maintenance', count: 1 },
];

export const getFinancialStats = () => ({
  totalRevenue: 178500,
  pendingPayments: 45000,
  totalExpenses: 95000,
  netProfit: 83500,
  averageRoomRate: 450,
});

export const getOperationalStats = () => ({
  totalStudents: 200,
  totalRooms: 50,
  totalComplaints: 160,
  resolvedComplaints: 124,
  pendingComplaints: 36,
  staffCount: 12,
});
