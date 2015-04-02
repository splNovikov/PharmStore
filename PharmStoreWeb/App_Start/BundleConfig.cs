using pharmStoreWeb.Utils;
using System.Web;
using System.Web.Optimization;

namespace PharmStoreWeb
{

	public class BundleConfig
	{

		public static void RegisterBundles(BundleCollection bundles)
		{
			BundleTable.EnableOptimizations = true;

			RegisterThirdPartyLibs(bundles);

			RegisterUserScriptBundle(bundles);
		}

		private static void RegisterThirdPartyLibs(BundleCollection bundles)
		{
			bundles.Add(new JsBundle("~/bundles/libs").Include(
				"~/Scripts/libs/angular/angular.js",
				"~/Scripts/libs/angular/angular-route.js",
				"~/Scripts/libs/angular/angular-local-storage.js",
				"~/Scripts/libs/angular/angular-websql.js",
				"~/Scripts/libs/angular/angular-ui-router.js",
				"~/Scripts/libs/angular/angular-sanitize.js",
				"~/Scripts/libs/angular/angular-ui/ui-bootstrap-tpls.js",

				"~/Scripts/libs/jquery/jquery-{version}.js",
				"~/Scripts/libs/bootstrap/bootstrap.min.js",

				"~/Scripts/libs/lodash/lodash.min.js",

				"~/Scripts/libs/materialDesign/material.js",
				"~/Scripts/libs/materialDesign/ripples.js"
				));

			bundles.Add(new StyleBundle("~/Content/css").Include(
				"~/Content/libs/bootstrap/bootstrap.css",
				"~/Content/libs/fontAwesome/font-awesome.css"
				));
		}

		private static void RegisterUserScriptBundle(BundleCollection bundles)
		{
			bundles.Add(new JsBundle("~/bundles/app").Include(

				// Helpful directives
				"~/Scripts/app/helpfulDirectives/helpDirectives.module.js",
				"~/Scripts/app/helpfulDirectives/helpDirectives.digitsOnly.directive.js",
				"~/Scripts/app/helpfulDirectives/helpDirectives.ngEnter.directive.js",
				"~/Scripts/app/helpfulDirectives/helpDirectives.offClick.directive.js",

				// Modals
				"~/Scripts/app/modals/modals.module.js",
				"~/Scripts/app/modals/modals.constants.js",
				"~/Scripts/app/modals/modals.service.js",
				"~/Scripts/app/modals/modals.confirm.controller.js",
				"~/Scripts/app/modals/modals.alert.controller.js",

				// Login
				"~/Scripts/app/login/login.module.js",
				"~/Scripts/app/login/login.page.controller.js",
				"~/Scripts/app/login/login.loggedUser.directive.js",
				"~/Scripts/app/login/login.service.js",
				"~/Scripts/app/login/login.auth.service.js",

				// Lookup
				"~/Scripts/app/lookup/lookup.module.js",
				"~/Scripts/app/lookup/lookup.directive.js",
				"~/Scripts/app/lookup/lookup.scrolled.js",

				// Main
				"~/Scripts/app/main/main.module.js",
				"~/Scripts/app/main/main.controller.js",
				// directices
				"~/Scripts/app/main/directives/main.header.directive.js",
				"~/Scripts/app/main/directives/main.body.directive.js",
				// services
				"~/Scripts/app/main/services/main.priceStorageData.service.js",

				// Interceptors
				"~/Scripts/app/interceptors/interceptors.module.js",
				"~/Scripts/app/interceptors/interceptor.authentication.js",

				"~/Scripts/app/app.js",
				"~/Scripts/app/app.config.js",
				"~/Scripts/app/app.start.js",
				"~/Scripts/app/app.layout.controller.js"));

			bundles.Add(new LessBundle("~/Content/siteLess").Include(
						"~/Content/appStyles/site.less"));
		}
	}
}