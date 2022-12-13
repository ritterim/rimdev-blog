---
layout: ../layouts/Post.astro
title: "Secure Global Stuntman Users With Windows Azure Blob Storage"
date: 2017-05-07 12:41:40
tags:
- Windows Azure
- Azure
- Stuntman
- OSS
categories:
twitter_text: "Secure Global #Stuntman Users With @azure Blob Storage"
authors: Khalid Abuhakmeh
image: https://farm7.staticflickr.com/6120/7037746887_cb990d077c_k_d.jpg
image_url: https://www.flickr.com/photos/zeroden/
image_credit: Zero Den
---

[Stuntman](https://rimdev.io/stuntman) is an open source library we developed at [RIMdev](https://rimdev.io) to make testing user scenarios easier during development time. There are times we need to interact with our quality assurance environments to access APIs. In addition, developers may need to share test users locally when integrating between two applications. With Stuntman, we realized this may be a common scenario we want to develop for, so we did. 

Stuntman offers the ability to consume test users from a remote source. It allows multiple applications to share users, their claims, and API access tokens.

```csharp
var stuntmanOptions = new StuntmanOptions
{
    AllowBearerTokenPassthrough = true,
    AllowCookieAuthentication = false,
}
.AddUsersFromJson(appSettings.StuntmanUsersUrl);

app.UseStuntman(stuntmanOptions);
```

It is that easy in our applications, but we need a secure source of users that we can trust. That is where Windows Azure and Shared Access Signature (SAS) can help.

## Step 1 : Create A Stuntman Users JSON File

Stuntman has a specific JSON schema it is expecting.

```json
{
    "Users": [
        {
            "Id": "<unique user id>",
            "AccessToken": "<unique access token>",
            "Name": "Stuntman User",
            "Description": "Stuntman User From Global Source",
            "Source": "Global",
            "Claims": [
              
                {
                    "Issuer": "LOCAL AUTHORITY",
                    "OriginalIssuer": "LOCAL AUTHORITY",
                    "Properties": {},
                    "Subject": null,
                    "Type": "given_name",
                    "Value": "Stuntman",
                    "ValueType": "http://www.w3.org/2001/XMLSchema#string"
                },
                {
                    "Issuer": "LOCAL AUTHORITY",
                    "OriginalIssuer": "LOCAL AUTHORITY",
                    "Properties": {},
                    "Subject": null,
                    "Type": "family_name",
                    "Value": "User (SM)",
                    "ValueType": "http://www.w3.org/2001/XMLSchema#string"
                }
            ]
        },      
    ]
}
```

We need to set the claims, access token, and identifiers for all users we want to share across our applications. Once this is complete, we just need to save the file.

## Step 2: Uploading The File To Blob Storage

I recommend using [Microsoft Azure Storage Explorer](http://storageexplorer.com/). We'll need to use an existing blob container, or create a new one to store our json file.

![stuntman container for json](/images/stuntman-global-users/stuntman-azure-step-1.png){: .img-fluid .border }

In the image above, I created a `stuntman` container. Next, just upload the file.

![stuntman container microsoft azure storage explorer](/images/stuntman-global-users/stuntman-azure-step-2.png){: .img-fluid .border }

Once uploaded, use Microsoft Azure Storage Explorer to generate a SAS. Do this by right clicking, and selecting *"Get Shared Access Signature..."*

![stuntman container microsoft azure storage explorer options](/images/stuntman-global-users/stuntman-azure-step-3.png){: .img-fluid .border }

Select a time period that your SAS will be valid. Talk to your security team to determine what may be a reasonable time. Also be sure to only give `READ` access. Once your settings are done, click `Create`.

![stuntman container microsoft azure SAS](/images/stuntman-global-users/stuntman-azure-step-4.png){: .img-fluid .border }

You should now see a dialog with values for `URL` and `querystring`. You will need the `URL` value for your Stuntman setup.

## Step 3: Setup Stuntman

Now, use Stuntman like you regularly would. 

```csharp
var stuntmanOptions = new StuntmanOptions
{
    AllowBearerTokenPassthrough = true,
    AllowCookieAuthentication = false,
}
.AddUsersFromJson(appSettings.StuntmanUsersUrl);

app.UseStuntman(stuntmanOptions);
```

The `appSettings.StuntmanUsersUrl` is just the string we copied from Microsoft Azure Storage Explorer. **Note, if reading the url from web.config, remember to encode the string or your XML will be invalid.**

## Conclusion

Stuntman is powerful and can accelerate development tasks and help you ship faster. By utilizing Windows Azure and blob storage, we can share users in a secure and centralized manner. Hope you found this post helpful, and please leave a comment if you did. We'd love to hear from our users, especially since Stuntman 2.0 is right around the corner.