using HostelAI.API.Data;
using HostelAI.API.Services;
using Microsoft.EntityFrameworkCore;

namespace HostelAI.API.Seeds;

public static class AuthenticationSeeder
{
    public static async Task SeedDemoUsersAsync(HostelAiDbContext context, IPasswordService passwordService)
    {
        var demoUsers = new[]
        {
            new User
            {
                FullName = "Admin User",
                Email = "admin@hostelai.com",
                PasswordHash = string.Empty,
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Warden Davis",
                Email = "warden@hostelai.com",
                PasswordHash = string.Empty,
                Role = "Warden",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Accountant Smith",
                Email = "accountant@hostelai.com",
                PasswordHash = string.Empty,
                Role = "Accountant",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Security Chief",
                Email = "security@hostelai.com",
                PasswordHash = string.Empty,
                Role = "SecurityStaff",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "John Doe",
                Email = "student@hostelai.com",
                PasswordHash = string.Empty,
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        var existingUsers = await context.Users.ToListAsync();
        var usersByEmail = existingUsers
            .GroupBy(user => user.Email, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.First(), StringComparer.OrdinalIgnoreCase);
        var legacyPasswords = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["admin@hostelai.com"] = "admin123",
            ["warden@hostelai.com"] = "warden123",
            ["accountant@hostelai.com"] = "accountant123",
            ["security@hostelai.com"] = "security123"
        };

        foreach (var demoUser in demoUsers)
        {
            if (!usersByEmail.TryGetValue(demoUser.Email, out var existingUser))
            {
                demoUser.PasswordHash = passwordService.HashPassword("Password@123");
                await context.Users.AddAsync(demoUser);
                continue;
            }

            var isLegacySeedPassword = legacyPasswords.TryGetValue(demoUser.Email, out var legacyPassword)
                && passwordService.NeedsRehash(existingUser.PasswordHash)
                && passwordService.VerifyPassword(legacyPassword, existingUser.PasswordHash);
            var isPlaceholderHash = existingUser.PasswordHash == "demo-hash";
            if (isLegacySeedPassword || isPlaceholderHash)
            {
                existingUser.PasswordHash = passwordService.HashPassword("Password@123");
                existingUser.Role = demoUser.Role;
                existingUser.IsActive = true;
            }
        }

        await context.SaveChangesAsync();
    }
}
