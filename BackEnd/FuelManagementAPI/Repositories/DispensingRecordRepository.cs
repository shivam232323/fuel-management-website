using MySqlConnector;
using FuelManagementAPI.Models;
using FuelManagementAPI.DTOs;
using FuelManagementAPI.Services;

namespace FuelManagementAPI.Repositories
{
    public interface IDispensingRecordRepository
    {
        Task<DispensingRecord> CreateAsync(DispensingRecord record);
        Task<List<DispensingRecord>> GetRecordsByUserAsync(int userId, FilterRequest filter);
    }

    public class DispensingRecordRepository : IDispensingRecordRepository
    {
        private readonly IDbService _dbService;

        public DispensingRecordRepository(IDbService dbService)
        {
            _dbService = dbService;
        }

        public async Task<DispensingRecord> CreateAsync(DispensingRecord record)
        {
            using (var conn = await _dbService.GetConnectionAsync())
            {
                var query = @"INSERT INTO dispensing_records 
                    (user_id, dispenser_no, quantity, vehicle_number, payment_mode, payment_proof_filename) 
                    VALUES (@userId, @dispenserNo, @quantity, @vehicleNumber, @paymentMode, @paymentProof);
                    SELECT LAST_INSERT_ID();";

                using (var cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@userId", record.UserId);
                    cmd.Parameters.AddWithValue("@dispenserNo", record.DispenserNo);
                    cmd.Parameters.AddWithValue("@quantity", record.Quantity);
                    cmd.Parameters.AddWithValue("@vehicleNumber", record.VehicleNumber);
                    cmd.Parameters.AddWithValue("@paymentMode", record.PaymentMode);
                    cmd.Parameters.AddWithValue("@paymentProof", record.PaymentProofFilename ?? (object)DBNull.Value);

                    var id = await cmd.ExecuteScalarAsync();
                    record.Id = Convert.ToInt32(id);
                    record.CreatedAt = DateTime.Now;
                    return record;
                }
            }
        }

        public async Task<List<DispensingRecord>> GetRecordsByUserAsync(int userId, FilterRequest filter)
        {
            var records = new List<DispensingRecord>();

            using (var conn = await _dbService.GetConnectionAsync())
            {
                var query = "SELECT id, user_id, dispenser_no, quantity, vehicle_number, payment_mode, payment_proof_filename, created_at FROM dispensing_records WHERE user_id = @userId";


                if (!string.IsNullOrEmpty(filter?.DispenserNo) && filter.DispenserNo != "ALL DISPENSERS")
                    query += " AND dispenser_no = @dispenserNo";

                if (!string.IsNullOrEmpty(filter?.PaymentMode) && filter.PaymentMode != "ALL PAYMENT MODES")
                    query += " AND payment_mode = @paymentMode";

                if (filter?.StartDate.HasValue == true)
                    query += " AND created_at >= @startDate";

                if (filter?.EndDate.HasValue == true)
                    query += " AND created_at <= @endDate";

                query += " ORDER BY created_at DESC";

                using (var cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@userId", userId);

                    if (!string.IsNullOrEmpty(filter?.DispenserNo))
                        cmd.Parameters.AddWithValue("@dispenserNo", filter.DispenserNo);

                    if (!string.IsNullOrEmpty(filter?.PaymentMode))
                        cmd.Parameters.AddWithValue("@paymentMode", filter.PaymentMode);

                    if (filter?.StartDate.HasValue == true)
                        cmd.Parameters.AddWithValue("@startDate", filter.StartDate.Value);

                    if (filter?.EndDate.HasValue == true)
                        cmd.Parameters.AddWithValue("@endDate", filter.EndDate.Value.AddDays(1));

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            records.Add(new DispensingRecord
                            {
                                Id = reader.GetInt32(0),
                                UserId = reader.GetInt32(1),
                                DispenserNo = reader.GetString(2),
                                Quantity = reader.GetDecimal(3),
                                VehicleNumber = reader.GetString(4),
                                PaymentMode = reader.GetString(5),
                                PaymentProofFilename = reader.IsDBNull(6) ? null : reader.GetString(6),
                                CreatedAt = reader.GetDateTime(7)
                            });
                        }
                    }
                }
            }

            return records;
        }
    }
}
