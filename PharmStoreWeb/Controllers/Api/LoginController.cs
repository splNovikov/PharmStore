using PharmStoreWeb.Models;
using PharmStoreWeb.Models.Login;
using PharmStoreWeb.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Globalization;
using System.IdentityModel.Tokens;
using System.IdentityModel.Protocols.WSTrust;

namespace PharmStoreWeb.Controllers.Api
{
	public class LoginController : ApiController
	{
		[HttpPost]
		public object Authenticate(Credentials data)
		{
			var user =
			Back.All.FirstOrDefault(
				c => (c.Login == data.Login || c.Email == data.Email) && c.Password == data.Password);

			if (user == null)
			{
				return HttpStatusCode.Forbidden;
			}

			var profile = new User
			{
				Id = user.Id,
				Address = user.Address,
				Email = user.Email,
				Login = user.Login,
				Name = user.Name,
				NetworkId = user.NetworkId
			};

			// We are sending the profile inside the token
			var token = Sign(profile, null);

			var branches = GetUserBranches(user);

			return new
			{
				Token = token,
				User = profile,
				Branches = branches
			};
		}

		private object GetUserBranches(User user)
		{
			var branches = Back.All.Where(
				c => (c.NetworkId == user.NetworkId)).Select(c => new { c.Id, c.Name, c.Address });

			return branches;
		}

		private static string Sign(User profile, int? expiresInMinutes)
		{

			var tokenHandler = new JwtSecurityTokenHandler();

			// Token Creation
			var now = DateTime.UtcNow;
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
					new Claim(ClaimTypes.Name, profile.Login),
					new Claim(ClaimTypes.Email, profile.Email),
					new Claim(ClaimTypes.NameIdentifier, profile.Id.ToString(CultureInfo.InvariantCulture)),

				}),
				TokenIssuerName = "self",
				AppliesToAddress = "http://www.example.com",
				SigningCredentials = new SigningCredentials(new InMemorySymmetricSecurityKey(GetSecurityKey()), "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256", "http://www.w3.org/2001/04/xmlenc#sha256"),
			};
			if (expiresInMinutes != null)
			{
				tokenDescriptor.Lifetime = new Lifetime(now, now.AddMinutes(expiresInMinutes.Value));
			}

			var token = tokenHandler.CreateToken(tokenDescriptor);

			// Generate Token and return string
			var tokenString = tokenHandler.WriteToken(token);

			return tokenString;
		}

		private static byte[] GetSecurityKey()
		{
			return GetBytes("ВмосковскомМузеедекоративноприкладногоинародногоискусствапокажуточереднуюсериюдокументальногопроекта!wazzupMan");
		}

		private static byte[] GetBytes(string str)
		{
			var bytes = new byte[str.Length * sizeof(char)];
			Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
			return bytes;
		}
	}
}
