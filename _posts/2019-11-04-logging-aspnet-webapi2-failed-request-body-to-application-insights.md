---
layout: post
title: "Logging ASP.NET Web API 2 Failed Request Body to Application Insights"
date: 2019-11-04 11:30:00
tags:
- .NET
categories:
- development
twitter_text: "Logging ASP.NET Web API 2 Failed Request Body to Application Insights #aspnet #dotnet"
authors: Ken Dale
image: https://images.unsplash.com/photo-1534848812-17d9c573d7d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/1IxbvNXx5QA
image_credit: Thomas Chan
---

Debugging web applications can be difficult sometimes. When debugging a failed HTTP GET request in Application Insights you have all of the information. But, when looking at failed HTTP POST/PUT/PATCH requests the request body is an important part in reproducing an issue. And, without the request body, debugging an issue can be difficult.

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System.Diagnostics;
using System.IO;
using System.Web;

namespace YourNamespace
{
    // Reference: https://thirum.wordpress.com/2019/08/19/logging-the-http-response-body-in-application-insights/
    //
    // Ideally this is deprecated in the future for functionality baked into Application Insights
    // (although, it doesn't state whether they plan to support ASP.NET full framework with this or not):
    // https://github.com/Microsoft/ApplicationInsights-aspnetcore/issues/686#issuecomment-545531512
    public class FailedRequestBodyTelemetry : ITelemetryInitializer
    {
        private const string RequestBodyProperty = "RequestBody";

        public void Initialize(ITelemetry telemetry)
        {
            var requestTelemetry = telemetry as RequestTelemetry;

            if (requestTelemetry == null || HttpContext.Current == null)
            {
                return;
            }

            var request = HttpContext.Current.Request;
            var response = HttpContext.Current.Response;

            if (request == null || response == null)
            {
                return;
            }

            if (!int.TryParse(requestTelemetry.ResponseCode, out var responseCode))
            {
                return;
            }

            if (responseCode < 400) // non-success status code
            {
                return;
            }

            if (!request.InputStream.CanSeek)
            {
                Trace.WriteLine("Failed request body was not added to the Application Insights telemetry due to non-buffered input stream.");
                return;
            }

            using (var streamReader = new StreamReader(request.InputStream, request.ContentEncoding, true, 1024, true))
            {
                request.InputStream.Position = 0;

                var requestContent = streamReader.ReadToEnd();

                request.InputStream.Position = 0;

                if (string.IsNullOrEmpty(requestContent))
                {
                    return;
                }

                if (requestTelemetry.Properties.ContainsKey(RequestBodyProperty))
                {
                    requestTelemetry.Properties[RequestBodyProperty] = requestContent;
                }
                else
                {
                    requestTelemetry.Properties.Add(RequestBodyProperty, requestContent);
                }
            }
        }
    }
}
```

You'll need this too to enable request body rewinding:

```csharp
using System.Web.Http.WebHost;

namespace YourNamespace
{
    public class InputStreamAlwaysBufferedPolicySelector : WebHostBufferPolicySelector
    {
        public override bool UseBufferedInputStream(object hostContext)
        {
            return true;
        }
    }
}
```

Now, we can wire these up:

```csharp
using Microsoft.ApplicationInsights.Extensibility;
using Owin;
using System;
using System.Web.Http;
using System.Web.Http.Hosting;

namespace YourNamespace
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            config.Services.Replace(
                typeof(IHostBufferPolicySelector),
                new InputStreamAlwaysBufferedPolicySelector());

            app.UseWebApi(config); 

            TelemetryConfiguration.Active.TelemetryInitializers.Add(new FailedRequestBodyTelemetry());
        }
    }
}
```

## Note

**Request bodies may contain sensitive information. Depending on your data it may make sense to log this only in a non-production environment. And, if you need to scrub the data prior to sending it, make sure you do so!**
