---
title: A Brief Intro to Azure Blob Storage Lifecycle Management
slug: storage-lifecycle-management
date: 2024-06-03 12:00:00
tags:
- DevOps
- Azure
- Azure Storage
- Lifecycle Management
- Blob storage
categories:
- DevOps
- Azure
authors: 
- Chad Peters
twitter_text: "A Brief Intro to Azure Blob Storage Lifecycle Management"
---

We've recently been taking a closer look at our Azure costs. One area we identified cost savings is in our Storage costs. All the data we store has a unique lifecycle. For example, some data gets created, read once, and then is never needed again. Some data has a 10-year storage retention policy but might never get accessed in that 10 years. Other data gets stored and read often. However, we store all this data in the Hot tier. We could realize significant storage cost savings by implementing Lifecycle Management on our storage accounts. Before we get started, click [here](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview) if you need an introduction or refresher on blob access tiers.

Azure Blob Storage lifecycle management offers a rule-based policy that you can use to transition blob data to the appropriate access tiers during its lifecycle. This includes the ability to expire data by deleting it at the end of the data lifecycle. A policy is a collection of rules in a JSON document that contain a filter set and an action set. The filter set limits rule actions to a certain set of objects within a container. The action set applies the tier or delete actions to the filtered set of objects. Applying rules to our various types of data will allow us to realize cost savings as we move our data to the appropriate tier or delete it. 

Below is a collection of notes I made while researching lifecycle management. They are particularly relevant to our situation, and hopefully useful to you. 

## Getting started 🚩

To get started, pop open your Azure portal, find your storage account, and then look for Lifecycle Management under Data Management. Here you can see your existing policies and add new ones. When adding a new policy, you can use the UI wizard by selecting List View. You can add a new policy using JSON by choosing the Code View. 

Policies run once a day. When you create a new one or make changes to an existing one it can take up to 24 hours for the policy to run. If you disable a policy while it was running then it will complete its run. When the actions defined in a policy complete, a LifecyclePolicyCompleted event is generated.

## Moving data 🚚

You have a couple of options for moving data based on age. First, you can move it based on the date it was last created. Second, you can move it based on the date it was modified. Third, you can move it based on last accessed time. Before doing the latter, you must explicitly enable [access time tracking](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-policy-configure?tabs=azure-portal#optionally-enable-access-time-tracking). You can also expire data by deleting it based on these rules.

Additionally, you can move data by blob index tag. You can also move blobs by prefix match. If you have blob storage versioning enabled you can move previous versions of an object. 

## Pricing 💰

There is no cost for Lifecycle Management policies. You are billed for standard operation costs associated with moving a blob to a different tier. Moving to a cooler tier incurs write operation (per 10,000) charges of the destination tier. Moving to a warmer tier incurs the read operation (per 10,000) and data retrieval (per GB) charges of the source tier. 

All tiers besides the Hot tier have a minimum number of required days a blob must remain in that tier. Deleting or moving your blob to a different tier before the required number of days pass will result in an early deletion penalty. The number of days for Cool is 30, Cold is 90, and Archive is 180. For example, you upload a blob to the Cool tier and then delete it or move it to Cold after 20 days. You'll be charged for 10 days of Cool storage since you moved it 10 days before the 30 day minimum. You also pay the penalty if the entire object is rewritten through any operation within this period. 

If you start by loading your data into the appropriate tier you will avoid the cost of moving blobs between tiers. There are two ways you can do this. First, you can specify the tier your blob should be assigned to when uploading the blob. Second, you can set the [default access tier](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview#default-account-access-tier-setting) for a storage account to a cooler tier. 

If you have last access time enabled, you will pay the "other operations" fee every time it updates. You are only charged that once per 24 hours no matter how many times you access the blob in the 24 hour period.

If you want to learn more about the Azure Blob Storage pricing you can start [here](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/). 

## Permissions ✋🏻

Lifecycle Management policy has its own set of permissions:

- Microsoft.Storage/storageAccounts/managementPolicies/delete - Delete storage account management policies

- Microsoft.Storage/storageAccounts/managementPolicies/read - Get storage management account policies

- Microsoft.Storage/storageAccounts/managementPolicies/write - Put storage account management policies

Any user you want to manage your policy would need each permission assigned. I don't see any RBAC roles for management policies. The closest role I can find is `Storage Account Contributor` which would grant wide-ranging access to your storage account. You could define a custom role for working with lifecycle management policies that includes these permissions. 

I hope this short overview is helpful as a starting point for your investigation of Lifecycle Management in your Azure Storage accounts. Below are some additional resources to help you on your way. 

[Lifecycle Management Overview](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview) | [Cost Estimation Workbook](https://azure.github.io/Storage/docs/backup-and-archive/azure-archive-storage-cost-estimation/azure-archive-storage-cost-estimation.xlsx)


