---
layout: post
title: Redact Elasticsearch Passwords from Microsoft Azure Application Insights Using C#
date: 2019-08-09 10:00:00
tags:
- .NET
categories:
- development
twitter_text: "Redact Elasticsearch Passwords from Microsoft Azure Application Insights Using C#"
authors: Ken Dale
image: https://images.unsplash.com/photo-1499346146792-b008e446261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/eMnddgd3pjQ
image_credit: Simon Abrams
---

We use Microsoft Azure [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) in our web applications. It logs tons of useful data about our applications, including web requests and requests to dependencies like databases. We also use [Elasticsearch](https://www.elastic.co) communicating over HTTPS. **When an Elasticsearch url contains a password (`https://user:passw0rd@example.com`) we found it is logged to Application Insights in cleartext.**

That said, here's how to redact the password from any urls containing passwords:

## Code

Here's an `ITelemetryProcessor` implementation that redacts passwords from HTTP and HTTPS urls.

```csharp
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System.Text.RegularExpressions;

namespace WebApplication
{
    public class RemoveHttpUrlPasswordsTelemetry : ITelemetryProcessor
    {
        private static readonly Regex removePasswordRegex =
            new Regex(@"http(s)?:\/\/.+:(?<password>.+)@", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private readonly ITelemetryProcessor next;

        public RemoveHttpUrlPasswordsTelemetry(ITelemetryProcessor next)
        {
            this.next = next;
        }

        public void Process(ITelemetry item)
        {
            var request = item as DependencyTelemetry;

            if (request != null && request.Type == "Http")
            {
#pragma warning disable CS0618 // Type or member is obsolete
                request.CommandName = RemovePasswordFromUrl(request.CommandName);
#pragma warning restore CS0618 // Type or member is obsolete
                request.Data = RemovePasswordFromUrl(request.Data);
            }

            next.Process(item);
        }

        private static string RemovePasswordFromUrl(string url)
        {
            var match = removePasswordRegex.Match(url).Groups["password"];

            if (match.Success)
            {
                url = url.Replace(match.Value, "REDACTED");
            }

            return url;
        }
    }
}
```

Next, use the `RemoveHttpUrlPasswordsTelemetry` class with Application Insights. There's ASP.NET and ASP.NET Core examples at [https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling#filtering-itelemetryprocessor](https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling#filtering-itelemetryprocessor).

This can help raise your security by not storing passwords in logs!
