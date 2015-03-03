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

		public ActionResult ModalConfirm()
		{
			return PartialView("~/Views/Components/Confirms/_ModalConfirm.cshtml");
		}

		public ActionResult ModalAlert()
		{
			return PartialView("~/Views/Components/Alerts/_ModalAlert.cshtml");
		}

		public ActionResult AlertDrugView()
		{
			return PartialView("~/Views/Components/Alerts/Templates/_DrugViewTmpl.cshtml");
		}

		public ActionResult AlertCustomerView()
		{
			return PartialView("~/Views/Components/Alerts/Templates/_CustomerViewTmpl.cshtml");
		}

		public ActionResult ConfirmExitView()
		{
			return PartialView("~/Views/Components/Confirms/Templates/_ExitViewTmpl.cshtml");
		}

	}
}
