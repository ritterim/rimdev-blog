---
layout: post
title: Running an AppVeyor Build After Creating an Azure Web App Using Terraform
date: 2019-01-10 15:00:00
tags:
- Terraform
- OSS
categories:
- development
twitter_text: "Running an AppVeyor Build After Creating an Azure Web App Using Terraform"
authors: Ken Dale
image: https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80
image_url: https://unsplash.com/photos/QdAAasrZhdk
image_credit: Lance Anderson
---

We're in the process of scaffolding out our [Microsoft Azure](https://azure.microsoft.com) environments using [Terraform](https://www.terraform.io/). While Terraform does an excellent job creating Azure Web Apps, it still needs code to be deployed before the application can be used.

We currently manage our deployments using AppVeyor. Here's how to get Terraform to invoke a fresh build of `master` after the resource is created:

```
resource "azurerm_app_service" "app-service" {
  name                    = "${var.name}"
  location                = "${var.location}"
  resource_group_name     = "${var.resource_group_name}"
  app_service_plan_id     = "${var.service_plan_id}"

  provisioner "local-exec" {
    # Invoke AppVeyor build
    command = <<EOF
$headers = @{
  "Authorization" = "Bearer ${var.appveyor_api_key}"
  "Content-Type" = "application/json"
}

$body = @{
  "accountName" = "RimDev"
  "projectSlug" = "${var.repository_name}"
  "branch" = "master"
} | ConvertTo-Json

Invoke-RestMethod -Uri https://ci.appveyor.com/api/builds -Method Post -Headers $headers -Body $body
EOF
    interpreter = ["PowerShell", "-Command"]
  }
}
```

The PowerShell script requires the following *(there are other Terraform variables in the above, too)*:

- `${var.repository_name}` *(just the repository name, not organization/repository-name)*
- `${var.appveyor_api_key}` *(can be obtained at [https://ci.appveyor.com](https://ci.appveyor.com))*

The `local-exec` block runs on the machine running `terraform apply`, so you'll also need PowerShell to be available.

Enjoy using this script or modifying it to suit your needs!
