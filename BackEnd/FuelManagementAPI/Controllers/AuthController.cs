using Microsoft.AspNetCore.Mvc;
using FuelManagementAPI.DTOs;
using FuelManagementAPI.Services;
using FuelManagementAPI.Repositories;

namespace FuelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly ITokenService _tokenService;

        public AuthController(IAuthRepository authRepository, ITokenService tokenService)
        {
            _authRepository = authRepository;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new LoginResponse { Success = false, Message = "Username and password are required." });
            }

            var user = await _authRepository.GetUserByUsernameAsync(request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password." });
            }

            var token = _tokenService.GenerateToken(user.Id, user.Username);

            return Ok(new LoginResponse
            {
                Success = true,
                Message = "Login successful.",
                Token = token
            });
        }
    }
}
