using Microsoft.EntityFrameworkCore;

namespace HostelAI.API.Data;

public class HostelAiDbContext : DbContext
{
    public HostelAiDbContext(DbContextOptions<HostelAiDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Bed> Beds => Set<Bed>();
    public DbSet<Allocation> Allocations => Set<Allocation>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<Complaint> Complaints => Set<Complaint>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Visitor> Visitors => Set<Visitor>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Student>().HasIndex(s => s.StudentCode).IsUnique();
        modelBuilder.Entity<Room>().HasIndex(r => r.RoomNumber).IsUnique();
        modelBuilder.Entity<Allocation>()
            .HasOne(a => a.Student)
            .WithMany(s => s.Allocations)
            .HasForeignKey(a => a.StudentId);

        modelBuilder.Entity<Allocation>()
            .HasOne(a => a.Room)
            .WithMany(r => r.Allocations)
            .HasForeignKey(a => a.RoomId);

        modelBuilder.Entity<Allocation>()
            .HasOne(a => a.Bed)
            .WithMany(b => b.Allocations)
            .HasForeignKey(a => a.BedId);

        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Student)
            .WithMany(s => s.Attendances)
            .HasForeignKey(a => a.StudentId);

        modelBuilder.Entity<Complaint>()
            .HasOne(c => c.Student)
            .WithMany(s => s.Complaints)
            .HasForeignKey(c => c.StudentId);

        modelBuilder.Entity<Complaint>()
            .HasOne(c => c.Room)
            .WithMany(r => r.Complaints)
            .HasForeignKey(c => c.RoomId);

        modelBuilder.Entity<LeaveRequest>()
            .HasOne(l => l.Student)
            .WithMany(s => s.LeaveRequests)
            .HasForeignKey(l => l.StudentId);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Student)
            .WithMany(s => s.Payments)
            .HasForeignKey(p => p.StudentId);

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Student)
            .WithMany(s => s.Invoices)
            .HasForeignKey(i => i.StudentId);

        modelBuilder.Entity<Visitor>()
            .HasOne(v => v.Student)
            .WithMany(s => s.Visitors)
            .HasForeignKey(v => v.StudentId);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId);
    }
}
