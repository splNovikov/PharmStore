using BundleTransformer.Core.Transformers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace PharmPriceWeb.Utils
{
	public class LessBundle : Bundle
	{
		public LessBundle(string virtualPath)
			: base(virtualPath)
		{
			this.Transforms.Add(new StyleTransformer());
		}
	}
}