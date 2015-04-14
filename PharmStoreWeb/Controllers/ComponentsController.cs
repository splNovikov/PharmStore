using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PharmStoreWeb.Controllers
{
	public class ComponentsController : Controller
	{
		public ActionResult LookupView()
		{
			return PartialView("~/Views/Components/_Lookup.cshtml");
		}

		public ActionResult ModalBasicView()
		{
			return PartialView("~/Views/Components/Modals/_ModalBasic.cshtml");
		}
		
		public ActionResult ModalStaticConfirmView()
		{
			return PartialView("~/Views/Components/Modals/Nested/_ModalStaticConfirm.cshtml");
		}

		public ActionResult ModalDrugInfoView()
		{
			return PartialView("~/Views/Components/Modals/Nested/_ModalDrugInfo.cshtml");
		}

		public ActionResult ModalCustomerInfoView()
		{
			return PartialView("~/Views/Components/Modals/Nested/_ModalCustomerInfo.cshtml");
		}

	}
}
