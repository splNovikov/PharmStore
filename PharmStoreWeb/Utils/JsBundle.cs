using BundleTransformer.Core.Transformers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace pharmStoreWeb.Utils
{
	public class JsBundle : Bundle
	{
		public JsBundle(string virtualPath)
			: base(virtualPath)
		{
			this.Transforms.Add(new ScriptTransformer());
		}
	}
}