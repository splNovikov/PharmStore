using PharmStoreWeb.Models.Users;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PharmStoreWeb.Models
{
	public static class Back
	{
		private static User Apteka1 = new User { Id = 1, Name = "Apteka1", Login = "Apteka1", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor1@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka2 = new User { Id = 2, Name = "Apteka2", Login = "Apteka2", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor2@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka3 = new User { Id = 3, Name = "Apteka3", Login = "Apteka3", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor3@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka4 = new User { Id = 4, Name = "Apteka4", Login = "Apteka4", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor4@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka5 = new User { Id = 5, Name = "Apteka5", Login = "Apteka5", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor5@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka6 = new User { Id = 6, Name = "Apteka6", Login = "Apteka6", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor6@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka7 = new User { Id = 7, Name = "Apteka7", Login = "Apteka7", Address = "Новоастраханское шоссе, и т.д.", Email = "provizor7@yandex.ru", Password = "12345", NetworkId = 1 };
		private static User Apteka8 = new User { Id = 8, Name = "Apteka8", Login = "Apteka8", Address = "неизвесно че ", Email = "smth@yandex.ru", Password = "12345" };

		public static readonly IEnumerable<User> All = new List<User>
			{
				Apteka1,
				Apteka2,
				Apteka3,
				Apteka4,
				Apteka5,
				Apteka6,
				Apteka7,
				Apteka8
			};
	}
}