using MySqlConnector;

namespace FuelManagementAPI.Services
{
    public interface IDbService
    {
        Task<MySqlConnection> GetConnectionAsync();
    }

    public class DbService : IDbService
    {
        private readonly string _connectionString;

        public DbService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public async Task<MySqlConnection> GetConnectionAsync()
        {
            var connection = new MySqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }
    }
}
