---
title: "Design Dilemma: Windows Azure Management, Jekyll, and Deployments"
slug: design-dilemma-windows-azure-management-jekyll-and-deployments
date: 2017-01-11 14:34:37
tags:
- question
- architecture
- jekyll
categories:
- Design Dilemma
twitter_text: "Design Dilemma: @windowsazure, #jekyll, and #deployments #dotnet"
authors: 
- Khalid Abuhakmeh 
image: https://farm7.staticflickr.com/6045/6322051654_84b730e08a_b_d.jpg
image_url: https://www.flickr.com/photos/zeevveez/
image_credit: zeevveez
---

We are all in when it comes to static site generation. With [Windows Azure][azure] [GitHub][github] integration, it has never been easier to deploy our content, but there is one problem that still needs solved:

> How do I publish a future post when there are no forseeable deployments/merges happening between now and the publish date of the future post?

My current answer is to utilize [Windows Azure Service Management][rest] to trigger a redeployment by utilizing the `sync` feature. This would be done through a job process. The redeployment would be run on regular intervals (hourly), thus giving future posts the oppurtunity to be published. Here is the basic code to interact with the REST API.

```csharp
using System;
using System.Configuration;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Azure.Management.WebSites;
using Microsoft.Rest;

namespace Resync
{
    class Program
    {
        private static string ClientId;
        private static string ClientSecret;
        private static string TenantId;
        private static string ResourceGroupName;
        private static string SiteName;
        private static string SubscriptionId;

        static void Main()
        {
            /* Get Settings */
            ClientId = ConfigurationManager.AppSettings[nameof(ClientId)];
            ClientSecret = ConfigurationManager.AppSettings[nameof(ClientSecret)];
            TenantId = ConfigurationManager.AppSettings[nameof(TenantId)];
            ResourceGroupName = ConfigurationManager.AppSettings[nameof(ResourceGroupName)];
            SiteName = ConfigurationManager.AppSettings["WEBSITE_SITE_NAME"];
            SubscriptionId = ConfigurationManager.AppSettings[nameof(SubscriptionId)];

            var token = GetAccessTokenAsync().GetAwaiter().GetResult();
            var credentials = new TokenCredentials(token.AccessToken);

            var client = new WebSiteManagementClient(credentials)
            {
                SubscriptionId = "<subscription id>"
            };

            client.Sites.SyncSiteRepository(ResourceGroupName, SiteName);
        }

        private static async Task<AuthenticationResult> GetAccessTokenAsync()
        {
            var cc = new ClientCredential(ClientId, ClientSecret);
            var context = new AuthenticationContext($"https://login.windows.net/{TenantId}");
            var token = await context.AcquireTokenAsync("https://management.azure.com/", cc);
            if (token == null)
            {
                throw new InvalidOperationException("Could not get the token");
            }
            return token;
        }
    }
}
```

> Which of the following architectures would you choose?

### 1. Each Jekyll Deployment Has Its Own job

THe idea is that this job would be included in each Jekyll instance and be deployed with the static site.

#### Pros

- Each site is responsible for itself.
- While the job is simple, it can evolve over time and apps can opt-in to features.

#### Cons

- Configuration is a headache, and having to do it for each Jekyll instance is tedious.
- The job is azure specific, and makes no sense locally.

### 2. Centralized Sync Service

Rather than having each site responsible for calling `sync`, I would just centralize a job to do that `sync` for each site.

#### Pros

- The task of calling `sync` is in one place.
- Can add and remove sites as needed.
- One time configuration.

#### Cons

- Yet another service that is doing a relatively simple task.

## What would you choose?

I could see using either approach, and neither is clearly better than the other. Which would you choose and why?

[rest]: https://msdn.microsoft.com/en-us/library/azure/ee460799.aspx
[azure]: https://windowsazure.com
[github]: https://github.com