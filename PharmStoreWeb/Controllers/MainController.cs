using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PharmStoreWeb.Controllers
{
	public class MainController : Controller
	{
		public ActionResult Index()
		{
			return PartialView("~/Views/Main/_Index.cshtml");
		}

		public ActionResult HeaderView()
		{
			return PartialView("~/Views/Main/_Header.cshtml");
		}

		public ActionResult BodyView()
		{
			return PartialView("~/Views/Main/_Body.cshtml");
		}

	}
}
