using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PharmStoreWeb.Controllers
{
	public class LoginController : Controller
	{
		public ActionResult Index()
		{
			return PartialView("~/Views/Login/_Index.cshtml");
		}

	}
}
