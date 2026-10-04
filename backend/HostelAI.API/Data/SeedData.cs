using HostelAI.API.Data;
using HostelAI.API.Services;

namespace HostelAI.API.Data;

public static class SeedData
{
    public static void Initialize(HostelAiDbContext context, IPasswordService passwordService)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return;
        }

        var admin = new User
        {
            FullName = "Admin Hostel",
            Email = "admin@hostelai.com",
            PasswordHash = passwordService.HashPassword("Password@123"),
            Role = "Admin"
        };

        var student = new User
        {
            FullName = "Ayesha Khan",
            Email = "ayesha@hostelai.com",
            PasswordHash = passwordService.HashPassword("Password@123"),
            Role = "Student"
        };

        var warden = new User
        {
            FullName = "Mina Warden",
            Email = "warden@hostelai.com",
            PasswordHash = passwordService.HashPassword("Password@123"),
            Role = "Warden"
        };

        var accountant = new User
        {
            FullName = "Bilal Accountant",
            Email = "accountant@hostelai.com",
            PasswordHash = passwordService.HashPassword("Password@123"),
            Role = "Accountant"
        };

        var security = new User
        {
            FullName = "Haris Security",
            Email = "security@hostelai.com",
            PasswordHash = passwordService.HashPassword("Password@123"),
            Role = "SecurityStaff"
        };

        context.Users.AddRange(admin, student, warden, accountant, security);
        context.SaveChanges();

        var room = new Room
        {
            RoomNumber = "301",
            Floor = 3,
            Capacity = 2,
            RoomType = "AC",
            Status = "Occupied"
        };

        context.Rooms.Add(room);
        context.SaveChanges();

        context.Beds.Add(new Bed { RoomId = room.Id, BedNumber = "A", Status = "Occupied" });
        context.Beds.Add(new Bed { RoomId = room.Id, BedNumber = "B", Status = "Occupied" });
        context.SaveChanges();

        var studentProfile = new Student
        {
            UserId = student.Id,
            StudentCode = "STU001",
            Department = "Computer Science",
            YearOfStudy = 3,
            PhoneNumber = "+92 300 1234567",
            EmergencyContact = "Mother",
            MedicalInfo = "No allergies"
        };

        context.Students.Add(studentProfile);
        context.SaveChanges();

        context.Allocations.Add(new Allocation
        {
            StudentId = studentProfile.Id,
            RoomId = room.Id,
            BedId = context.Beds.First().Id,
            CheckInDate = DateTime.UtcNow.AddMonths(-2),
            Status = "Active"
        });

        context.Attendances.Add(new Attendance
        {
            StudentId = studentProfile.Id,
            Date = DateTime.UtcNow.Date,
            Status = "Present",
            Method = "Face",
            VerifiedBy = "System"
        });

        context.Complaints.Add(new Complaint
        {
            StudentId = studentProfile.Id,
            RoomId = room.Id,
            Category = "Maintenance",
            Description = "AC fan makes noise",
            Priority = "Medium",
            Status = "Open",
            AssignedTo = "Electrician"
        });

        context.LeaveRequests.Add(new LeaveRequest
        {
            StudentId = studentProfile.Id,
            StartDate = DateTime.UtcNow.AddDays(5),
            EndDate = DateTime.UtcNow.AddDays(8),
            Reason = "Family visit",
            Status = "Pending"
        });

        context.Payments.Add(new Payment
        {
            StudentId = studentProfile.Id,
            Amount = 4500,
            Type = "Fee",
            Status = "Completed",
            ReferenceNumber = "PAY-001"
        });

        context.Invoices.Add(new Invoice
        {
            StudentId = studentProfile.Id,
            InvoiceNumber = "INV-001",
            Amount = 4500,
            DueDate = DateTime.UtcNow.AddDays(15),
            Status = "Pending"
        });

        context.Visitors.Add(new Visitor
        {
            StudentId = studentProfile.Id,
            VisitorName = "Muhammad Ali",
            VisitorPhone = "+92 333 7654321",
            Approved = true,
            Purpose = "Family visit"
        });

        context.Notifications.Add(new Notification
        {
            UserId = student.Id,
            Type = "Alert",
            Message = "Your leave request is under review.",
            IsRead = false
        });

        context.SaveChanges();
    }
}
