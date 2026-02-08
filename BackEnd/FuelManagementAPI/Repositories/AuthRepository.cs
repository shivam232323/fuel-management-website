using MySqlConnector;
using FuelManagementAPI.Models;
using FuelManagementAPI.Services;

namespace FuelManagementAPI.Repositories
{
    public interface IAuthRepository
    {
        Task<User> GetUserByUsernameAsync(string username);
    }

    public class AuthRepository : IAuthRepository
    {
        private readonly IDbService _dbService;

        public AuthRepository(IDbService dbService)
        {
            _dbService = dbService;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            using (var conn = await _dbService.GetConnectionAsync())
            {
                var query = "SELECT id, username, password, created_at FROM users WHERE username = @username";
                
                using (var cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@username", username);
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new User
                            {
                                Id = reader.GetInt32(0),
                                Username = reader.GetString(1),
                                Password = reader.GetString(2),
                                CreatedAt = reader.GetDateTime(3)
                            };
                        }
                    }
                }
            }
            return null;
        }
    }
}
