using System;
using System.Security.AccessControl;
using System.Reflection.Metadata;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.Entities;
using API.Data;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _siginManager;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> siginManager, 
        ITokenService tokenService, IMapper mapper)
        {
            _siginManager = siginManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            // using var hmac = new HMACSHA512();

            user.UserName = registerDto.UserName.ToLower();
            // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            // user.PasswordSalt = hmac.Key;

            var result = await _userManager.CreateAsync(user,registerDto.Password);

            if(!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user,"Member");

            if(!roleResult.Succeeded) return BadRequest(result.Errors);

            UserDTO returnUser = new UserDTO
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };

            return returnUser;

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
        {
            var user = await _userManager.Users.Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.UserName == loginDto.UserName.ToLower());

            if (user == null) return Unauthorized("Invalid username");

            // using var hmac = new HMACSHA512(user.PasswordSalt);
            // // each user has a password salt that acts as a key, password salt goes down below

            // var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            // for (int i = 0; i < computedHash.Length; i++)
            // {
            //     if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
            // }

            var result = await _siginManager
            .CheckPasswordSignInAsync(user,loginDto.Password,false);

            if(!result.Succeeded) return Unauthorized();

            return new UserDTO
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.Count > 0 ?user.Photos.FirstOrDefault(photo => photo.IsMain == true).Url : "",
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}