using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FuelManagementAPI.DTOs;
using FuelManagementAPI.Models;
using FuelManagementAPI.Repositories;

namespace FuelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DispensingRecordsController : ControllerBase
    {
        private readonly IDispensingRecordRepository _recordRepository;
        private readonly IWebHostEnvironment _hostEnvironment;

        public DispensingRecordsController(IDispensingRecordRepository recordRepository, IWebHostEnvironment hostEnvironment)
        {
            _recordRepository = recordRepository;
            _hostEnvironment = hostEnvironment;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("UserId");
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpPost("create")]
        public async Task<ActionResult<DispensingRecordResponse>> CreateRecord(
            [FromForm] CreateDispensingRecordRequest request,
            [FromForm] IFormFile paymentProof)
        {
            if (string.IsNullOrWhiteSpace(request.DispenserNo) || string.IsNullOrWhiteSpace(request.VehicleNumber))
            {
                return BadRequest("Dispenser No and Vehicle Number are required.");
            }

            if (request.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            if (paymentProof == null || paymentProof.Length == 0)
            {
                return BadRequest("Payment proof file is required.");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var fileExtension = Path.GetExtension(paymentProof.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Only .jpg, .png, and .pdf files are allowed.");
            }

            if (paymentProof.Length > 5 * 1024 * 1024) // 5 MB
            {
                return BadRequest("File size must not exceed 5 MB.");
            }

            string uploadsFolder = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string uniqueFileName = $"{Guid.NewGuid()}_{paymentProof.FileName}";
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await paymentProof.CopyToAsync(stream);
            }

            var record = new DispensingRecord
            {
                UserId = GetUserId(),
                DispenserNo = request.DispenserNo,
                Quantity = request.Quantity,
                VehicleNumber = request.VehicleNumber,
                PaymentMode = request.PaymentMode,
                PaymentProofFilename = uniqueFileName
            };

            var createdRecord = await _recordRepository.CreateAsync(record);

            return Ok(new DispensingRecordResponse
            {
                Id = createdRecord.Id,
                DispenserNo = createdRecord.DispenserNo,
                Quantity = createdRecord.Quantity,
                VehicleNumber = createdRecord.VehicleNumber,
                PaymentMode = createdRecord.PaymentMode,
                PaymentProofFilename = createdRecord.PaymentProofFilename,
                CreatedAt = createdRecord.CreatedAt
            });
        }

        [HttpPost("list")]
        public async Task<ActionResult<List<DispensingRecordResponse>>> GetRecords([FromBody] FilterRequest filter)
        {
            var records = await _recordRepository.GetRecordsByUserAsync(GetUserId(), filter);

            var responses = records.Select(r => new DispensingRecordResponse
            {
                Id = r.Id,
                DispenserNo = r.DispenserNo,
                Quantity = r.Quantity,
                VehicleNumber = r.VehicleNumber,
                PaymentMode = r.PaymentMode,
                PaymentProofFilename = r.PaymentProofFilename,
                CreatedAt = r.CreatedAt
            }).ToList();

            return Ok(responses);
        }

        [HttpGet("download/{filename}")]
        public IActionResult DownloadFile(string filename)
        {
            try
            {
                string uploadsFolder = Path.Combine(_hostEnvironment.ContentRootPath, "Uploads");
                string filePath = Path.Combine(uploadsFolder, filename);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found.");
                }

                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                var contentType = Path.GetExtension(filePath).ToLowerInvariant() switch
                {
                    ".pdf" => "application/pdf",
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    _ => "application/octet-stream"
                };

                return File(fileBytes, contentType, filename);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error downloading file: {ex.Message}");
            }
        }
    }
}
