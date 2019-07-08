---
layout: post
title: "Updating donet https certificate after password change"
date: 2019-07-08 11:03:43
tags:
    - Keychain
    - MacOS
    - Certificates
categories:
    - MacOS
    - Keychain
twitter_text: "Updating donet https certificate after password change"
authors: 
  - Chidozie Oragwu
  - Khalid Abuhakmeh
image: https://images.unsplash.com/photo-1553386323-60698d6f7325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80
image_url: https://unsplash.com/photos/7BhTfoKsheQ
image_credit: Jason D
---

If you build dotnet core apps on your mac and install https certificates to your keychain for development purposes, it’s helpful to know that they are tied to your password at the time of creation. If the password to your Mac subsequently changes, you may run into issues launching your app due to the https certificate being invalid. 

This post covers what to do about the certificate error in order to get working again. 

## Synopsis

I recently had to change my MacOS password and was greeted with the dialog below after logging into the computer a few days later:
![Result](/images/keychain-certificates/keychain_prompt.png "Key Chain Prompt")

I thought nothing of it and clicked `Update Keychain Password` which seemed like the most reasonable option. 

The next time I tried to run my app, I got the error saying the certificate was no longer valid.  
```bash
System.InvalidOperationException: Unable to configure HTTPS endpoint. No server certificate was specified, and the default developer certificate could not be found.

To generate a developer certificate run 'dotnet dev-certs https'. To trust the certificate (Windows and macOS only) run 'dotnet dev-certs https --trust'.
```

I tried to follow the recommendation in the error to run `dotnet dev-certs https` but it failed saying a certificate already exists:
![Result](/images/keychain-certificates/cert_already_exists.png "Certificate Exists")

## The fix

I was confused. Luckily for me, [@buhakmeh](https://twitter.com/buhakmeh) had the fix. Turns out the existing certificate was no longer valid because my password had changed. The fix is to delete the old certificate and generate a new one.

### Steps to generate a new certificate:
- Open the `Keychain Access` app and click `Certificates`
    ![Result](/images/keychain-certificates/manage_certs.png "Manage Certificates")
- Right click the affected certificate and click `Delete`
    ![Result](/images/keychain-certificates/delete_cert.png "Delete Certificate")
- Generate a new certificate using `dotnet dev-certs https --trust` should work now.

Hopefully this is useful to someone out there. 
    