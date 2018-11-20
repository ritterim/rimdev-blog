---
layout: post
title: Export CSV Table of All Azure Web Apps Configuration in Subscription
date: 2018-11-20 12:30:00
tags:
- Azure
- Configuration
- OSS
categories:
- development
twitter_text: "Export CSV Table of All Azure Web Apps Configuration in Subscription"
authors: Ken Dale
image: https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-0.3.5&s=4a647d42fac71c6e8e5ae5f45fe2d4c8&auto=format&fit=crop&w=2252&q=80
image_url: https://unsplash.com/photos/lUaaKCUANVI
image_credit: Kimberly Farmer
---

At [Ritter Insurance Marketing](https://www.ritterim.com/) we utilize [Azure Web Apps](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-overview/) for hosting many of our web applications. [Azure Web Apps](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-overview/) is a platform as a service (PaaS) offering from Microsoft, enabling their customers to host web applications without managing and maintaining the server infrastructure.

Given the number of Azure Web Apps we have, reporting on and managing configuration across the entire environment can be difficult. With each app seperate, it is difficult to get an overall view of configuration (AlwaysOn, HTTP2, etc.), as well as app settings and connection strings.

**Answering even simple questions about configuration across the board can be challenging** when each application is a seperate unrelated entity. **In our case, it helped find connection strings needing an update due to a deprecation.**

Fortunately, the Azure CLI enables programmatic access to these configuration items. **Writing a script to compile the data and output to CSV is exactly what we did!** It's on GitHub at [https://github.com/ritterim/azure-web-apps-configuration-table-exporter](https://github.com/ritterim/azure-web-apps-configuration-table-exporter).

## Quickstart

- Install Node.js *(if not already installed)*.
- Install Azure CLI.
- Login using Azure CLI (`az login`).
- Clone or download the [ritterim/azure-web-apps-configuration-table-exporter](https://github.com/ritterim/azure-web-apps-configuration-table-exporter) repository.
- Run `npm install`.
- Run `node ./index.js` to get a generated filename. It can optionally be specified as `node ./index.js --file output.csv`.
- Watch and wait, depending on the number of web applications in the current subscription it can take considerable time.

## Contributions

Found a bug or have an idea? We welcome contributions at the [GitHub repository](https://github.com/ritterim/azure-web-apps-configuration-table-exporter).

___

We hope you find this tool useful!
