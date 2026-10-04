namespace HostelAI.API.Data;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Student";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public class Student
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int YearOfStudy { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    public string MedicalInfo { get; set; } = string.Empty;

    public User? User { get; set; }
    public ICollection<Allocation> Allocations { get; set; } = new List<Allocation>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    public ICollection<Visitor> Visitors { get; set; } = new List<Visitor>();
}

public class Room
{
    public int Id { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public int Capacity { get; set; }
    public string RoomType { get; set; } = "Standard";
    public string Status { get; set; } = "Available";

    public ICollection<Bed> Beds { get; set; } = new List<Bed>();
    public ICollection<Allocation> Allocations { get; set; } = new List<Allocation>();
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
}

public class Bed
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";

    public Room Room { get; set; } = null!;
    public ICollection<Allocation> Allocations { get; set; } = new List<Allocation>();
}

public class Allocation
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int RoomId { get; set; }
    public int BedId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public string Status { get; set; } = "Active";

    public Student Student { get; set; } = null!;
    public Room Room { get; set; } = null!;
    public Bed Bed { get; set; } = null!;
}

public class Attendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = "Present";
    public string Method { get; set; } = "QR";
    public string VerifiedBy { get; set; } = "System";

    public Student Student { get; set; } = null!;
}

public class Complaint
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int RoomId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Open";
    public string AssignedTo { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Student Student { get; set; } = null!;
    public Room Room { get; set; } = null!;
}

public class LeaveRequest
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public string ApprovedBy { get; set; } = string.Empty;

    public Student Student { get; set; } = null!;
}

public class Payment
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = "Fee";
    public string Status { get; set; } = "Completed";
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string ReferenceNumber { get; set; } = string.Empty;

    public Student Student { get; set; } = null!;
}

public class Invoice
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "Pending";

    public Student Student { get; set; } = null!;
}

public class Visitor
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string VisitorName { get; set; } = string.Empty;
    public string VisitorPhone { get; set; } = string.Empty;
    public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
    public DateTime? CheckOutTime { get; set; }
    public bool Approved { get; set; }
    public string Purpose { get; set; } = string.Empty;

    public Student Student { get; set; } = null!;
}

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}

// Request/Response Models
public record LoginRequest(string Email, string Password);

public record RegisterRequest(string FullName, string Email, string Password, string? Role = null);

public record AuthResponse(int UserId, string FullName, string Email, string Role, string? Token = null);

public record DashboardResponse(
    string HostelName,
    int Occupancy,
    int OccupiedRooms,
    int TotalRooms,
    int Complaints,
    int AiAlerts,
    int AttendanceRate,
    int PendingApprovals,
    string MonthlyRevenue,
    string NextMaintenance
);

public record StudentResponse(
    int Id,
    string StudentCode,
    string Department,
    int YearOfStudy,
    string PhoneNumber,
    string EmergencyContact,
    string MedicalInfo,
    string FullName,
    string Email
);

public record CreateStudentRequest(
    string FullName,
    string Email,
    string StudentCode,
    string Department,
    int YearOfStudy,
    string PhoneNumber,
    string EmergencyContact,
    string MedicalInfo
);

