---
title: Setting Azure Web App Slot Auto Swap Using ARM Templates and Terraform
slug: setting-azure-web-app-slot-auto-swap-using-arm-templates-and-terraform
date: 2019-02-25 8:30:00
tags:
- Azure
- Terraform
categories:
- development
twitter_text: "Setting Azure Web App Slot Auto Swap Using ARM Templates and Terraform"
authors: 
- Ken Dale
image: https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80
image_url: https://unsplash.com/photos/QdAAasrZhdk
image_credit: Lance Anderson
---

We're in the process of scaffolding out our [Microsoft Azure](https://azure.microsoft.com) environments using [Terraform](https://www.terraform.io/). We're looking at deploying consistently from `master` going forward, but our new infrastructure design requires explicit swapping of staging slots to production. We want this to happen automatically though in our development environment, ensuring we're always using the latest code as we try things out in the cloud.

Many items in Terraform are supported in a first-class manner. However, sometimes you find an item not currently supported. In the case of Azure, we can specify absent Terraform provider functionality we need using ARM templates. It's a bit more verbose to setup than a simple built-in property, but it *works*.

**Here's the code:**

## Terraform

Assuming `azurerm_app_service.app_service` and `azurerm_app_service_slot.app_service_slot` are available *(update this template as needed)*:

```
resource "azurerm_template_deployment" "app_service_auto_swap" {
  name                = "my-app-service-auto-swap" 
  resource_group_name = "YOUR_RESOURCE_GROUP_NAME"
  deployment_mode     = "Incremental"

  template_body = "${file("./path/to/app-service-slot-auto-swap.json")}"

  parameters {
    "existingWebAppLocation" = "eastus"
    "webAppName"             = "${azurerm_app_service.app_service.name}"
    "slotName"               = "staging"
    "autoSwapSlotName"       = "production"
  }

  depends_on = [
    "azurerm_app_service.app_service",
    "azurerm_app_service_slot.app_service_slot"
  ]
}
```

## ARM Template

`app-service-slot-auto-swap.json`

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "existingWebAppLocation": {
      "type": "string",
      "metadata": {
        "description": "App location"
      }
    },
    "webAppName": {
      "type": "string",
      "metadata": {
        "description": "Example: app-name"
      }
    },
    "slotName": {
      "type": "string",
      "metadata": {
        "description": "Example: staging"
      }
    },
    "autoSwapSlotName": {
      "type": "string",
      "metadata": {
        "description": "Example: production"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Web/sites/slots",
      "name": "[concat(parameters('webAppName'), '/', parameters('slotName'))]",
      "apiVersion": "2015-08-01",
      "location": "[parameters('existingWebAppLocation')]",
      "properties": {
        "siteConfig": {
          "autoSwapSlotName": "[parameters('autoSwapSlotName')]"
        }
      }
    }
  ]
}
```
