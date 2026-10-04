using HostelAI.API.Data;
using HostelAI.API.Services;

namespace HostelAI.API.Seeds;

public static class AuthenticationSeeder
{
    public static async Task SeedDemoUsersAsync(HostelAiDbContext context, IPasswordService passwordService)
    {
        // Check if users already exist
        if (context.Users.Any())
        {
            Console.WriteLine("Users already seeded. Skipping...");
            return;
        }

        var demoUsers = new List<User>
        {
            new User
            {
                FullName = "Admin User",
                Email = "admin@hostelai.com",
                PasswordHash = passwordService.HashPassword("Password@123"),
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Warden Davis",
                Email = "warden@hostelai.com",
                PasswordHash = passwordService.HashPassword("Password@123"),
                Role = "Warden",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Accountant Smith",
                Email = "accountant@hostelai.com",
                PasswordHash = passwordService.HashPassword("Password@123"),
                Role = "Accountant",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Security Chief",
                Email = "security@hostelai.com",
                PasswordHash = passwordService.HashPassword("Password@123"),
                Role = "SecurityStaff",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "John Doe",
                Email = "student@hostelai.com",
                PasswordHash = passwordService.HashPassword("Password@123"),
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(demoUsers);
        await context.SaveChangesAsync();

        Console.WriteLine("Demo users seeded successfully!");
        Console.WriteLine("\nDemo Credentials:");
        Console.WriteLine("==================");
        foreach (var user in demoUsers)
        {
            Console.WriteLine($"Role: {user.Role}");
            Console.WriteLine($"Email: {user.Email}");
            Console.WriteLine($"Password: Password@123");
            Console.WriteLine("---");
        }
    }
}
