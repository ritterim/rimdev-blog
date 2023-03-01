---
title: "Non Pro/Premier SendGrid Accounts May Have Issues Sending to Popular Microsoft Domains (outlook.com, etc.)"
slug: non-pro-premier-sendgrid-accounts-may-have-issues-sending-to-popular-microsoft-domains-outlook-com-etc
date: 2019-10-21 14:00:00
tags:
- SendGrid
categories:
- development
twitter_text: "Non Pro/Premier @SendGrid Accounts May Have Issues Sending to Popular @Microsoft Domains (outlook.com, etc.)"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1534567406103-997f6c5e7f93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/ZXB6B8FkqwE
image_credit: Nikolay Tchaouchev
---

We recently started using [SendGrid](https://sendgrid.com) to send emails in production. As part of that, we noticed that emails to `outlook.com`, `hotmail.com`, `msn.com`, `live.com` were met with responses that looked like this:

```
550 5.7.1 Unfortunately, messages from [REDACTED_IP_ADDRESS] weren't sent. Please contact your Internet service provider since part of their network is on our block list (S3140). You can also refer your provider to http://mail.live.com/mail/troubleshooting.aspx#errors. [REDACTED.prod.protection.outlook.com]
```

**Simply put, our emails were showing up on the *Blocks* portion of the SendGrid UI and weren't being delivered to our users in these cases!**

## Fixing the problem

Unfortunately, it looks like the root cause is related to the sharing of IP address on the Free and Essentials SendGrid plans. Your reputation as a sender can be tarnished by the other users who may be sharing the same shared SendGrid IP address.

Upgrading to the Pro or Premier plans provides a dedicated IP address that isn't shared with others. This fixes the problem and email should no longer be blocked.

It costs more money but it's better than having undelivered email to important users!
