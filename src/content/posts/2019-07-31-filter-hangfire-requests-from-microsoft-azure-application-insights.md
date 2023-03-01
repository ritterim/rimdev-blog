---
title: Filter Hangfire Requests from Microsoft Azure Application Insights
slug: filter-hangfire-requests-from-microsoft-azure-application-insights
date: 2019-07-31 13:00:00
tags:
- .NET
categories:
- development
twitter_text: "Filter Hangfire Requests from Microsoft Azure Application Insights"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1516409590654-e8d51fc2d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/V29UWcALNko
image_credit: ron dyar
---

We use Microsoft Azure [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) in our web applications. It logs tons of useful data about our applications, including web requests and requests to dependencies like databases. We also use [Hangfire](https://www.hangfire.io/) for running jobs in our web applications. **Put these two together and you're logging lots of unnecessary information which ultimately costs money.**

That said, here's how to skip sending Hangfire information to Application Insights in ASP.NET web applications:

## Code

Here's an `ITelemetryProcessor` implementation that filters out Hangfire and Hangfire SQL.

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System;
using System.Data.SqlClient;

namespace WebApplication
{
    /// <summary>
    /// Ignore the dashboard and Hangfire SQL backend telemetry.
    /// </summary>
    /// <remarks>
    /// This does not support ignoring Redis or any other backend.
    /// </remarks>
    public class IgnoreHangfireTelemetry : ITelemetryProcessor
    {
        private readonly ITelemetryProcessor next;
        private readonly string hangfireDashboardPath;
        private readonly string sqlDatabase;

        public IgnoreHangfireTelemetry(
            ITelemetryProcessor next,
            string sqlConnectionString = null,
            string hangfireDashboardPath = "/hangfire")
        {
            this.next = next ?? throw new ArgumentNullException(nameof(next));

            if (!string.IsNullOrEmpty(sqlConnectionString))
            {
                var builder = new SqlConnectionStringBuilder(sqlConnectionString);

                sqlDatabase = builder.InitialCatalog;
            }

            this.hangfireDashboardPath = hangfireDashboardPath ?? throw new ArgumentNullException(nameof(hangfireDashboardPath));
        }

        public void Process(ITelemetry item)
        {
            var request = item as RequestTelemetry;

            if (request != null
                && request.Url.AbsolutePath.StartsWith(hangfireDashboardPath))
            {
                return;
            }

            if (sqlDatabase != null)
            {
                var sqlBackend = item as DependencyTelemetry;

                if (sqlBackend != null
                    && sqlBackend.Type == "SQL"
                    && sqlBackend.Target.EndsWith($"| {sqlDatabase}", StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }
            }

            next.Process(item);
        }
    }
}
```

Next, use the `IgnoreHangfireTelemetry` class with Application Insights. There's ASP.NET and ASP.NET Core examples at [https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling#filtering-itelemetryprocessor](https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling#filtering-itelemetryprocessor).

Enjoy the savings!
