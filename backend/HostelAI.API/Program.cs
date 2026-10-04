using HostelAI.API.Data;
using HostelAI.API.Services;
using HostelAI.API.Seeds;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<HostelAiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=hostelai.db"));

// Register JWT and Password services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? "your-super-secret-jwt-key-change-this-in-production-minimum-32-characters")),
        ValidateIssuer = true,
        ValidIssuer = issuer ?? "HostelAI",
        ValidateAudience = true,
        ValidAudience = audience ?? "HostelAIUsers",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Seed demo users in development
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<HostelAiDbContext>();
        var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordService>();
        await context.Database.EnsureCreatedAsync();
        await AuthenticationSeeder.SeedDemoUsersAsync(context, passwordService);
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "HostelAI API",
    mode = app.Environment.EnvironmentName
}));

app.MapPost("/api/auth/login", async (LoginRequest request, HostelAiDbContext context, IJwtService jwtService, IPasswordService passwordService) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { error = "Email and password are required." });
    }

    var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (user is null || !passwordService.VerifyPassword(request.Password, user.PasswordHash))
    {
        return Results.Json(new { error = "Invalid email or password. Demo password is Password@123" }, statusCode: 401);
    }

    if (!user.IsActive)
    {
        return Results.Json(new { error = "Account is inactive. Contact Administrator." }, statusCode: 401);
    }

    var token = jwtService.GenerateToken(user.Id, user.Email, user.FullName, user.Role);

    return Results.Ok(new
    {
        userId = user.Id,
        fullName = user.FullName,
        email = user.Email,
        role = user.Role,
        token
    });
});

app.MapPost("/api/auth/register", async (RegisterRequest request, HostelAiDbContext context, IPasswordService passwordService) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { error = "Full name, email, and password are required." });
    }

    var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (existingUser is not null)
    {
        return Results.BadRequest(new { error = "A user with this email already exists." });
    }

    var user = new User
    {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = passwordService.HashPassword(request.Password),
        Role = request.Role ?? "Student",
        IsActive = true
    };

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return Results.Created($"/api/users/{user.Id}", new { userId = user.Id, email = user.Email });
});

app.MapGet("/api/auth/me", (System.Security.Claims.ClaimsPrincipal user) =>
{
    if (user.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new
    {
        userId = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
        email = user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value,
        fullName = user.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value,
        role = user.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
    });
})
.RequireAuthorization();


app.MapGet("/api/dashboard", async (HostelAiDbContext context) =>
{
    var occupancy = await context.Rooms.CountAsync();
    var occupiedRooms = await context.Allocations.CountAsync(a => a.Status == "Active");
    var complaints = await context.Complaints.CountAsync(c => c.Status == "Open");
    var totalAttendances = await context.Attendances.CountAsync();
    var presentAttendances = await context.Attendances.CountAsync(a => a.Status == "Present");
    var attendanceRate = totalAttendances > 0 ? (int)Math.Round(presentAttendances * 100.0 / totalAttendances) : 0;
    var pendingApprovals = await context.LeaveRequests.CountAsync(l => l.Status == "Pending");

    return Results.Ok(new DashboardResponse(
        "HostelAI Horizon",
        occupancy > 0 ? (int)Math.Round(occupiedRooms * 100.0 / occupancy) : 0,
        occupiedRooms,
        occupancy,
        complaints,
        3,
        attendanceRate,
        pendingApprovals,
        "$24,800",
        complaints > 0 ? "Maintenance tasks are being coordinated" : "No urgent maintenance"
    ));
});

app.MapGet("/api/students", async (HostelAiDbContext context) =>
{
    var students = await context.Students
        .Include(s => s.User)
        .OrderByDescending(s => s.Id)
        .Select(s => new StudentResponse(
            s.Id,
            s.StudentCode,
            s.Department,
            s.YearOfStudy,
            s.PhoneNumber,
            s.EmergencyContact,
            s.MedicalInfo,
            s.User != null ? s.User.FullName : "Unknown",
            s.User != null ? s.User.Email : string.Empty))
        .ToListAsync();

    return Results.Ok(students);
});

app.MapPost("/api/students", async (CreateStudentRequest request, HostelAiDbContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.StudentCode))
    {
        return Results.BadRequest(new { error = "Please provide full name, email, and student code." });
    }

    var user = new User
    {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = "demo-hash",
        Role = "Student"
    };

    context.Users.Add(user);
    await context.SaveChangesAsync();

    var student = new Student
    {
        UserId = user.Id,
        StudentCode = request.StudentCode,
        Department = request.Department,
        YearOfStudy = request.YearOfStudy,
        PhoneNumber = request.PhoneNumber,
        EmergencyContact = request.EmergencyContact,
        MedicalInfo = request.MedicalInfo
    };

    context.Students.Add(student);
    await context.SaveChangesAsync();

    return Results.Created($"/api/students/{student.Id}", new StudentResponse(
        student.Id,
        student.StudentCode,
        student.Department,
        student.YearOfStudy,
        student.PhoneNumber,
        student.EmergencyContact,
        student.MedicalInfo,
        user.FullName,
        user.Email));
});

app.MapPut("/api/students/{id:int}", async (int id, UpdateStudentRequest request, HostelAiDbContext context) =>
{
    var student = await context.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.Id == id);
    if (student is null)
    {
        return Results.NotFound(new { error = "Student not found." });
    }

    student.StudentCode = request.StudentCode;
    student.Department = request.Department;
    student.YearOfStudy = request.YearOfStudy;
    student.PhoneNumber = request.PhoneNumber;
    student.EmergencyContact = request.EmergencyContact;
    student.MedicalInfo = request.MedicalInfo;

    if (student.User is not null)
    {
        student.User.FullName = request.FullName;
        student.User.Email = request.Email;
    }

    await context.SaveChangesAsync();

    return Results.Ok(new StudentResponse(
        student.Id,
        student.StudentCode,
        student.Department,
        student.YearOfStudy,
        student.PhoneNumber,
        student.EmergencyContact,
        student.MedicalInfo,
        student.User?.FullName ?? "Unknown",
        student.User?.Email ?? string.Empty));
});

app.MapDelete("/api/students/{id:int}", async (int id, HostelAiDbContext context) =>
{
    var student = await context.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.Id == id);
    if (student is null)
    {
        return Results.NotFound(new { error = "Student not found." });
    }

    context.Allocations.RemoveRange(context.Allocations.Where(a => a.StudentId == id));
    context.Attendances.RemoveRange(context.Attendances.Where(a => a.StudentId == id));
    context.Complaints.RemoveRange(context.Complaints.Where(c => c.StudentId == id));
    context.LeaveRequests.RemoveRange(context.LeaveRequests.Where(l => l.StudentId == id));
    context.Payments.RemoveRange(context.Payments.Where(p => p.StudentId == id));
    context.Invoices.RemoveRange(context.Invoices.Where(i => i.StudentId == id));
    context.Visitors.RemoveRange(context.Visitors.Where(v => v.StudentId == id));

    context.Students.Remove(student);

    if (student.User is not null)
    {
        context.Users.Remove(student.User);
    }

    await context.SaveChangesAsync();
    return Results.NoContent();
});

app.MapGet("/api/complaints", async (HostelAiDbContext context) =>
{
    var complaints = await context.Complaints
        .Include(c => c.Student)
        .OrderByDescending(c => c.Id)
        .Select(c => new ComplaintResponse(
            c.Id,
            c.StudentId,
            c.Student.StudentCode,
            c.Category,
            c.Description,
            c.Priority,
            c.Status,
            c.AssignedTo,
            c.CreatedAt))
        .ToListAsync();

    return Results.Ok(complaints);
});

app.MapGet("/api/rooms", async (HostelAiDbContext context) =>
{
    var rooms = await context.Rooms
        .OrderBy(r => r.RoomNumber)
        .Select(r => new RoomResponse(
            r.Id,
            r.RoomNumber,
            r.Floor,
            r.Capacity,
            r.RoomType,
            r.Status,
            context.Allocations.Count(a => a.RoomId == r.Id && a.Status == "Active")))
        .ToListAsync();

    return Results.Ok(rooms);
});

app.MapPost("/api/rooms", async (CreateRoomRequest request, HostelAiDbContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.RoomNumber))
    {
        return Results.BadRequest(new { error = "Room number is required." });
    }

    var room = new Room
    {
        RoomNumber = request.RoomNumber,
        Floor = request.Floor,
        Capacity = request.Capacity,
        RoomType = request.RoomType,
        Status = request.Status
    };

    context.Rooms.Add(room);
    await context.SaveChangesAsync();

    return Results.Created($"/api/rooms/{room.Id}", new RoomResponse(room.Id, room.RoomNumber, room.Floor, room.Capacity, room.RoomType, room.Status, 0));
});

app.MapPut("/api/rooms/{id:int}", async (int id, UpdateRoomRequest request, HostelAiDbContext context) =>
{
    var room = await context.Rooms.FirstOrDefaultAsync(r => r.Id == id);
    if (room is null)
    {
        return Results.NotFound(new { error = "Room not found." });
    }

    room.RoomNumber = request.RoomNumber;
    room.Floor = request.Floor;
    room.Capacity = request.Capacity;
    room.RoomType = request.RoomType;
    room.Status = request.Status;

    await context.SaveChangesAsync();
    return Results.Ok(new RoomResponse(room.Id, room.RoomNumber, room.Floor, room.Capacity, room.RoomType, room.Status, context.Allocations.Count(a => a.RoomId == room.Id && a.Status == "Active")));
});

app.MapDelete("/api/rooms/{id:int}", async (int id, HostelAiDbContext context) =>
{
    var room = await context.Rooms.FirstOrDefaultAsync(r => r.Id == id);
    if (room is null)
    {
        return Results.NotFound(new { error = "Room not found." });
    }

    context.Allocations.RemoveRange(context.Allocations.Where(a => a.RoomId == id));
    context.Complaints.RemoveRange(context.Complaints.Where(c => c.RoomId == id));
    context.Rooms.Remove(room);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

app.MapGet("/api/leave-requests", async (HostelAiDbContext context) =>
{
    var leaveRequests = await context.LeaveRequests
        .Include(l => l.Student)
        .OrderByDescending(l => l.Id)
        .Select(l => new LeaveRequestResponse(
            l.Id,
            l.Student.StudentCode,
            l.StartDate,
            l.EndDate,
            l.Reason,
            l.Status,
            l.ApprovedBy))
        .ToListAsync();

    return Results.Ok(leaveRequests);
});

app.MapGet("/api/payments", async (HostelAiDbContext context) =>
{
    var payments = await context.Payments
        .Include(p => p.Student)
        .OrderByDescending(p => p.Id)
        .Select(p => new PaymentResponse(
            p.Id,
            p.Student.StudentCode,
            p.Amount,
            p.Type,
            p.Status,
            p.PaymentDate,
            p.ReferenceNumber))
        .ToListAsync();

    return Results.Ok(payments);
});

app.MapPost("/api/payments", async (CreatePaymentRequest request, HostelAiDbContext context) =>
{
    var student = await context.Students.FirstOrDefaultAsync(s => s.StudentCode == request.StudentCode);
    if (student is null)
    {
        return Results.BadRequest(new { error = "Student code was not found." });
    }

    var payment = new Payment
    {
        StudentId = student.Id,
        Amount = request.Amount,
        Type = request.Type,
        Status = request.Status,
        PaymentDate = request.PaymentDate,
        ReferenceNumber = request.ReferenceNumber
    };

    context.Payments.Add(payment);
    await context.SaveChangesAsync();

    return Results.Created($"/api/payments/{payment.Id}", new PaymentResponse(payment.Id, student.StudentCode, payment.Amount, payment.Type, payment.Status, payment.PaymentDate, payment.ReferenceNumber));
});

app.MapGet("/api/invoices", async (HostelAiDbContext context) =>
{
    var invoices = await context.Invoices
        .Include(i => i.Student)
        .OrderByDescending(i => i.Id)
        .Select(i => new InvoiceResponse(
            i.Id,
            i.Student.StudentCode,
            i.InvoiceNumber,
            i.Amount,
            i.DueDate,
            i.Status))
        .ToListAsync();

    return Results.Ok(invoices);
});

app.MapPost("/api/invoices", async (CreateInvoiceRequest request, HostelAiDbContext context) =>
{
    var student = await context.Students.FirstOrDefaultAsync(s => s.StudentCode == request.StudentCode);
    if (student is null)
    {
        return Results.BadRequest(new { error = "Student code was not found." });
    }

    var invoice = new Invoice
    {
        StudentId = student.Id,
        InvoiceNumber = request.InvoiceNumber,
        Amount = request.Amount,
        DueDate = request.DueDate,
        Status = request.Status
    };

    context.Invoices.Add(invoice);
    await context.SaveChangesAsync();

    return Results.Created($"/api/invoices/{invoice.Id}", new InvoiceResponse(invoice.Id, student.StudentCode, invoice.InvoiceNumber, invoice.Amount, invoice.DueDate, invoice.Status));
});

app.MapGet("/api/visitors", async (HostelAiDbContext context) =>
{
    var visitors = await context.Visitors
        .Include(v => v.Student)
        .OrderByDescending(v => v.Id)
        .Select(v => new VisitorResponse(
            v.Id,
            v.Student.StudentCode,
            v.VisitorName,
            v.VisitorPhone,
            v.CheckInTime,
            v.CheckOutTime,
            v.Approved,
            v.Purpose))
        .ToListAsync();

    return Results.Ok(visitors);
});

app.MapPost("/api/visitors", async (CreateVisitorRequest request, HostelAiDbContext context) =>
{
    var student = await context.Students.FirstOrDefaultAsync(s => s.StudentCode == request.StudentCode);
    if (student is null)
    {
        return Results.BadRequest(new { error = "Student code was not found." });
    }

    var visitor = new Visitor
    {
        StudentId = student.Id,
        VisitorName = request.VisitorName,
        VisitorPhone = request.VisitorPhone,
        CheckInTime = request.CheckInTime,
        CheckOutTime = request.CheckOutTime,
        Approved = request.Approved,
        Purpose = request.Purpose
    };

    context.Visitors.Add(visitor);
    await context.SaveChangesAsync();

    return Results.Created($"/api/visitors/{visitor.Id}", new VisitorResponse(visitor.Id, student.StudentCode, visitor.VisitorName, visitor.VisitorPhone, visitor.CheckInTime, visitor.CheckOutTime, visitor.Approved, visitor.Purpose));
});

app.MapPost("/api/leave-requests", async (CreateLeaveRequestRequest request, HostelAiDbContext context) =>
{
    var student = await context.Students.FirstOrDefaultAsync(s => s.StudentCode == request.StudentCode);
    if (student is null)
    {
        return Results.BadRequest(new { error = "Student code was not found." });
    }

    var leaveRequest = new LeaveRequest
    {
        StudentId = student.Id,
        StartDate = request.StartDate,
        EndDate = request.EndDate,
        Reason = request.Reason,
        Status = request.Status,
        ApprovedBy = request.ApprovedBy
    };

    context.LeaveRequests.Add(leaveRequest);
    await context.SaveChangesAsync();

    return Results.Created($"/api/leave-requests/{leaveRequest.Id}", new LeaveRequestResponse(leaveRequest.Id, student.StudentCode, leaveRequest.StartDate, leaveRequest.EndDate, leaveRequest.Reason, leaveRequest.Status, leaveRequest.ApprovedBy));
});

app.MapPut("/api/leave-requests/{id:int}", async (int id, UpdateLeaveRequestRequest request, HostelAiDbContext context) =>
{
    var leaveRequest = await context.LeaveRequests.FirstOrDefaultAsync(l => l.Id == id);
    if (leaveRequest is null)
    {
        return Results.NotFound(new { error = "Leave request not found." });
    }

    leaveRequest.StartDate = request.StartDate;
    leaveRequest.EndDate = request.EndDate;
    leaveRequest.Reason = request.Reason;
    leaveRequest.Status = request.Status;
    leaveRequest.ApprovedBy = request.ApprovedBy;

    await context.SaveChangesAsync();
    return Results.Ok(new LeaveRequestResponse(leaveRequest.Id, (await context.Students.Where(s => s.Id == leaveRequest.StudentId).Select(s => s.StudentCode).FirstOrDefaultAsync()) ?? string.Empty, leaveRequest.StartDate, leaveRequest.EndDate, leaveRequest.Reason, leaveRequest.Status, leaveRequest.ApprovedBy));
});

app.MapDelete("/api/leave-requests/{id:int}", async (int id, HostelAiDbContext context) =>
{
    var leaveRequest = await context.LeaveRequests.FirstOrDefaultAsync(l => l.Id == id);
    if (leaveRequest is null)
    {
        return Results.NotFound(new { error = "Leave request not found." });
    }

    context.LeaveRequests.Remove(leaveRequest);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

app.MapPost("/api/complaints", async (CreateComplaintRequest request, HostelAiDbContext context) =>
{
    var student = await context.Students.FirstOrDefaultAsync();
    var room = await context.Rooms.FirstOrDefaultAsync();

    if (student is null || room is null)
    {
        return Results.BadRequest(new { error = "No student or room is available for a complaint." });
    }

    var complaint = new Complaint
    {
        StudentId = student.Id,
        RoomId = room.Id,
        Category = request.Category,
        Description = request.Description,
        Priority = request.Priority,
        Status = request.Status,
        AssignedTo = request.AssignedTo
    };

    context.Complaints.Add(complaint);
    await context.SaveChangesAsync();

    return Results.Created($"/api/complaints/{complaint.Id}", new ComplaintResponse(
        complaint.Id,
        complaint.StudentId,
        student.StudentCode,
        complaint.Category,
        complaint.Description,
        complaint.Priority,
        complaint.Status,
        complaint.AssignedTo,
        complaint.CreatedAt));
});

app.MapPut("/api/complaints/{id:int}", async (int id, UpdateComplaintRequest request, HostelAiDbContext context) =>
{
    var complaint = await context.Complaints.FirstOrDefaultAsync(c => c.Id == id);
    if (complaint is null)
    {
        return Results.NotFound(new { error = "Complaint not found." });
    }

    complaint.Category = request.Category;
    complaint.Description = request.Description;
    complaint.Priority = request.Priority;
    complaint.Status = request.Status;
    complaint.AssignedTo = request.AssignedTo;

    await context.SaveChangesAsync();

    return Results.Ok(new ComplaintResponse(
        complaint.Id,
        complaint.StudentId,
        (await context.Students.Where(s => s.Id == complaint.StudentId).Select(s => s.StudentCode).FirstOrDefaultAsync()) ?? string.Empty,
        complaint.Category,
        complaint.Description,
        complaint.Priority,
        complaint.Status,
        complaint.AssignedTo,
        complaint.CreatedAt));
});

app.MapDelete("/api/complaints/{id:int}", async (int id, HostelAiDbContext context) =>
{
    var complaint = await context.Complaints.FirstOrDefaultAsync(c => c.Id == id);
    if (complaint is null)
    {
        return Results.NotFound(new { error = "Complaint not found." });
    }

    context.Complaints.Remove(complaint);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<HostelAiDbContext>();
    SeedData.Initialize(db);
}

app.Run();

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
    string NextMaintenance);

public record StudentResponse(
    int Id,
    string StudentCode,
    string Department,
    int YearOfStudy,
    string PhoneNumber,
    string EmergencyContact,
    string MedicalInfo,
    string FullName,
    string Email);

public record CreateStudentRequest(
    string FullName,
    string Email,
    string StudentCode,
    string Department,
    int YearOfStudy,
    string PhoneNumber,
    string EmergencyContact,
    string MedicalInfo);

public record UpdateStudentRequest(
    string FullName,
    string Email,
    string StudentCode,
    string Department,
    int YearOfStudy,
    string PhoneNumber,
    string EmergencyContact,
    string MedicalInfo);

public record ComplaintResponse(
    int Id,
    int StudentId,
    string StudentCode,
    string Category,
    string Description,
    string Priority,
    string Status,
    string AssignedTo,
    DateTime CreatedAt);

public record CreateComplaintRequest(
    string Category,
    string Description,
    string Priority,
    string Status,
    string AssignedTo);

public record UpdateComplaintRequest(
    string Category,
    string Description,
    string Priority,
    string Status,
    string AssignedTo);

public record RoomResponse(
    int Id,
    string RoomNumber,
    int Floor,
    int Capacity,
    string RoomType,
    string Status,
    int OccupiedBeds);

public record CreateRoomRequest(
    string RoomNumber,
    int Floor,
    int Capacity,
    string RoomType,
    string Status);

public record UpdateRoomRequest(
    string RoomNumber,
    int Floor,
    int Capacity,
    string RoomType,
    string Status);

public record LeaveRequestResponse(
    int Id,
    string StudentCode,
    DateTime StartDate,
    DateTime EndDate,
    string Reason,
    string Status,
    string ApprovedBy);

public record CreateLeaveRequestRequest(
    string StudentCode,
    DateTime StartDate,
    DateTime EndDate,
    string Reason,
    string Status,
    string ApprovedBy);

public record UpdateLeaveRequestRequest(
    string StudentCode,
    DateTime StartDate,
    DateTime EndDate,
    string Reason,
    string Status,
    string ApprovedBy);

public record PaymentResponse(
    int Id,
    string StudentCode,
    decimal Amount,
    string Type,
    string Status,
    DateTime PaymentDate,
    string ReferenceNumber);

public record CreatePaymentRequest(
    string StudentCode,
    decimal Amount,
    string Type,
    string Status,
    DateTime PaymentDate,
    string ReferenceNumber);

public record InvoiceResponse(
    int Id,
    string StudentCode,
    string InvoiceNumber,
    decimal Amount,
    DateTime DueDate,
    string Status);

public record CreateInvoiceRequest(
    string StudentCode,
    string InvoiceNumber,
    decimal Amount,
    DateTime DueDate,
    string Status);

public record VisitorResponse(
    int Id,
    string StudentCode,
    string VisitorName,
    string VisitorPhone,
    DateTime CheckInTime,
    DateTime? CheckOutTime,
    bool Approved,
    string Purpose);

public record CreateVisitorRequest(
    string StudentCode,
    string VisitorName,
    string VisitorPhone,
    DateTime CheckInTime,
    DateTime? CheckOutTime,
    bool Approved,
    string Purpose);
