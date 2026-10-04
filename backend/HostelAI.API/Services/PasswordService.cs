using System.Security.Cryptography;
using System.Text;

namespace HostelAI.API.Services;

public interface IPasswordService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
    bool NeedsRehash(string hash);
}

public class PasswordService : IPasswordService
{
    private const string HashPrefix = "pbkdf2-sha256";
    private const int IterationCount = 600_000;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    public string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, IterationCount, HashAlgorithmName.SHA256, HashSize);
        return $"{HashPrefix}${IterationCount}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
    }

    public bool VerifyPassword(string password, string hash)
    {
        var parts = hash.Split('$');
        if (parts.Length == 4
            && parts[0] == HashPrefix
            && int.TryParse(parts[1], out var iterations)
            && iterations is >= 1 and <= 2_000_000)
        {
            try
            {
                var salt = Convert.FromBase64String(parts[2]);
                var expectedHash = Convert.FromBase64String(parts[3]);
                if (salt.Length < SaltSize || expectedHash.Length != HashSize)
                {
                    return false;
                }

                var actualHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, HashSize);
                return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
            }
            catch (FormatException)
            {
                return false;
            }
        }

        // Compatibility for accounts created by the previous SHA-256 and plaintext seed formats.
        var suppliedDigest = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        byte[] storedDigest;
        try
        {
            storedDigest = Convert.FromBase64String(hash);
            if (storedDigest.Length != HashSize)
            {
                storedDigest = SHA256.HashData(Encoding.UTF8.GetBytes(hash));
            }
        }
        catch (FormatException)
        {
            storedDigest = SHA256.HashData(Encoding.UTF8.GetBytes(hash));
        }

        return storedDigest.Length == suppliedDigest.Length
            && CryptographicOperations.FixedTimeEquals(suppliedDigest, storedDigest);
    }

    public bool NeedsRehash(string hash) => !hash.StartsWith($"{HashPrefix}$", StringComparison.Ordinal);
}
