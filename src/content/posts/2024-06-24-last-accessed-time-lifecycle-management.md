---
title: Hide and seek with Az Blob Last Accessed Time
slug: last-accessed-time-lifecycle-management
date: 2024-06-24 12:00:00
tags:
- DevOps
- Azure
- Azure Storage
- Lifecycle Management
- Blob storage
- Last Accessed Time
categories:
- DevOps
- Azure
authors: 
- Chad Peters
twitter_text: Hide and seek with Az Blob Last Accessed Time
---

My granddaughter went through a period in her 2s where she liked to play hide and seek. Last week I found myself again playing hide and seek, but this time with an Azure storage blob's last accessed time. Don't tell my grandie, but it was a little harder to find the last accessed time than it was to find her 😆.

In my last [post](https://rimdev.io/storage-lifecycle-management) I explained how we were working on lowering our Azure storage costs by using lifecycle management policy. We've been playing with lifecycle management policies in our development storage accounts. We recently enabled access time tracking in one those storage accounts. We added a lifecycle management policy to use the last access time to move our blobs through the access tiers.  

All files already in the storage account when you enable access time will have a null last accessed time. For those blobs Azure uses the policy creation date when applying the policy. Reading or writing a blob updates the last accessed time. I downloaded a few of the blobs via Azure Storage Explorer to make them have a last accessed time. To satisfy my curiosity, I opened the properties of a blob to see the last accessed time. No last access time property 🤔. 

Since I had my storage account opened in the Azure portal I used the Storage browser blade to open the blob container. Browsing to the blob I used the context menu to view the properties. No last accessed time there either 😕. Apparently last accessed time is a hide and seek pro. 

At this point I was battered and bruised, exhausted from my seeking, and ready to throw in the towel (ok, that may be a bit of an overdramatization). I figured I needed to get closer to the metal so I decided to see what Az Powershell could tell me. For my own future reference, and if it's helpful to you, here are the commands I used:

```ps
Connect-AzAccount # login and connect to a subscription

Set-AzCurrentStorageAccount -ResourceGroupName "<resource group name of your storage account>" -Name "<name of storage account>" # sets the storage context

$blob = Get-AzStorageBlob -Blob "<name of blob>" -Container "<name of container that has your blob>" # get the blob for which you want property information

echo $blob.BlobClient.GetProperties().Value # show the properties and their values
```

That returns a [BlobProperties](https://learn.microsoft.com/en-us/dotnet/api/azure.storage.blobs.models.blobproperties?view=azure-dotnet) object which contains the property `LastAccessed`. 

![Happy Dance](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnZ0Z2Z5NHdxbDQ2cjlwNHJlaXc1eTdubDNtY3dhbWFyaXUzZ253biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ofT5I53iCdlGUjzt6/giphy.gif)

Now I can do a little more testing with last accessed time in our lifecycle management policies. Soon we can set up some policies in production and start saving 💲💲. 

> Kudos to the Az Powershell team on their extremely helpful error messages. Check this out - not one but TWO specific suggestions to fix the problem! 
>
> `Get-AzStorageBlob: Could not get the storage context. Please pass in a storage context with "-Context" parameter (can be created with New-AzStorageContext cmdlet), or set the current storage context with Set-AzCurrentStorageAccount cmdlet.`


