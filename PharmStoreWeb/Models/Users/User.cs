using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PharmStoreWeb.Models.Users
{
	public class User
	{
		public int Id { get; set; }

		public string Name { get; set; }

		public string Login { get; set; }

		public string Address { get; set; }

		public string Password { get; set; }

		public string Email { get; set; }

		public int NetworkId { get; set; }
	}
}