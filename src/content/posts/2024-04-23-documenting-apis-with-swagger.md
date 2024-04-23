---
title: Documenting ASP.NET Core APIs with Swagger
slug: documenting-aspnetcore-apis-with-swagger
date: 2024-04-23 12:00:00
tags:
- backend
- ASP.NET Core
- API
- Swagger
- Swashbuckle
categories:
- backend
twitter_text: How to automatically import components in Astro MDX files.
authors: 
- Chad Peters
---

Nearly all of the APIs we create at Ritter are for consumption by our own applications. We regularly use [Swagger](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) as a tool for development and as a way for our Front End team to learn about the APIs as they are crafting the UI. Since we are a small team and any member of the FE team can just turn around and ask the BE team "Hey, what's this?" we don't spend too much, or any, time adding additional documentation to our endpoints and models other than what Swagger spits out by default.

We now have the opportunity to share one of our APIs with a third party so we need to step up our documentation game. This particular API had a custom written [descriptor](https://github.com/ritterim/descriptor) package that was used to provide complete API documentation. However, when we upgraded it to ASP.NET Core 6.0 from .NET Framework a year ago, we decided that since third party users of the API never materialized we weren't going to upgrade the descriptor package since no one but us was using our API, right 🤣? Well, here we are, and it now makes more sense to simply leverage the variety of ways that Swagger offers to fully document an ASP.NET Core API.

I'd like to briefly describe each that I found, provide examples and links for more research, and share any wins and limitations I found when testing them out. I'll then tell you where we are at currently and what additional work we would like to do. First, I'd like to clarify my use of "Swagger".

## Terms 📝

*Swagger* - is a systematic way of documenting the interface of a RESTful API under the OpenAPI Specification. The Swagger spec was given to the Linux foundation and became the OpenAPI Specification.

*Swashbuckle.AspNetCore* - is a package to generate Swagger specification for an ASP.NET Core API project. It has 3 "core" packages:
- .Swagger - is middleware to expose OpenApiDocument(s) as Swagger JSON endpoints.
- .SwaggerGen - generates OpenApiDocument(s) from routes, controllers and models.
- .SwaggerUI - creates an interactive UI from the Swagger JSON endpoints.

[Swagger home](https://swagger.io/)

[Swagger on Github](https://github.com/swagger-api)

To keep things simple, I'm just going to refer to all of this as "Swagger". If you need help getting started with setting up Swagger in your project visit Microsoft Learn's [Getting Started with Swashbuckle](https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle) page.

## Ways to document your API ✅

In my research, I discovered there are multiple ways you can help Swagger more fully describe your ASP.NET Core API. Many of these methods can be used to accomplish the same outcome, and which of these you'll use will be up to your particular situation. All of the examples below are from a small github project I created - [enhancing-swagger-documentation](https://github.com/lightyeare/enhancing-swagger-documentation). 

### XML comments

You may already be adding XML documentation comments to your C# code to provide other devs or your future self with helpful hints. It is also a great way to add additional context about your classes, methods, operators, indexers, constructors, and properties to your Swagger generated output for your ASP.NET Core APIs. It requires a little setup to enable XML comments in ASP.NET Core to be picked up by Swagger so make sure to pop down to the [XML Comments section](https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle#xml-comments) of the above "Getting Started with Swashbuckle" article.
<a name="controller-documented"></a>
```csharp
/// <summary>
/// Get customers
/// </summary>
/// <param name="request">A CustomerRequest object</param>
/// <returns>A CustomerSummaryRepresentation object</returns>
/// <remarks>
///    <i>Example GET:</i><br /> /customers?Status=Active
/// </remarks>  
/// <response code="200">Returns a CustomerSummaryRepresentation object.</response>
/// <response code="404">No customer records found.</response>
/// <response code="400">Request validation failed.</response>
```

![Controller Documented](/images/swagger/swagger-controller.jpg)

```csharp
///<summary>
/// Customer's Status. Valid Statuses are "Active" and "Inactive".
/// </summary> 
/// <example>Active</example>
public string Status { get; set; }
```
![Property Documented](/images/swagger/status.jpg)

Some XML comments, like `<example>` above do more than just provide additional text descriptions. In this case, Swagger will also populate the parameter value with your provided example. You can use this as a way to provide an end user with the happy path to using your API instead of them trying to guess which values will return a 200. Your example must be in the type of the property. For instance, if your property is an `array[string]` then your example must be `["MyString"]`. When used on a response object property, it will use that value as the property's value rather than using the property's type as it's value. If you were motivated, you could provide every response property with an example tag to completely fill out Swagger's example response with valid data rather than have it display the property type as the value. However, I prefer to use the `<example>` tag on my response properties so they can easily exercise the API and get real data. 

![Response property with example tag](/images/swagger/example-response.jpg)<br />
_customerId has an `<example>` tag and shows "1" instead of "int"._

One of the difficulties with even embarking on a documentation adventure is knowing that you must keep the documentation up to date. While I was documenting my properties I found myself writing the same comments for the same properties that we used on different models. We try to keep things DRY in our code, so shouldn't we be able to do that in our documentation? You can by creating a structured XML file that works for your domain and re-use the comments when a property is re-used on different models.

```csharp
<Docs>
  <RequestMembers>
    <Member name="Status">
      <summary>Customer Status. Valid Statuses are "Active" and "Inactive".</summary>
    </Member>
  </RequestMembers>
</Docs>
```

Then I can leverage the `<include>` tag with an XPath query to pull in the comments for that property any place I use it.

```csharp
/// <include file='../Documentation/EnhancingSwagger.xml' path='Docs/RequestMembers/Member[@name="Status"]/*' />
/// <example>Active</example>
public string Status { get; set; }
```

I like this approach because it feels like you are now elevating your documentation to a first class citizen of your application. There is a separate file that contains your documentation, and only one place to go when you need to make additions or updates. 

Visit [Recommended XML tags for C# documentation comments](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/xmldoc/recommended-tags) for a list of tags that are available and recommendations for their use. Note that not all of these tags will work on every object. For instance, class properties only pick up the summary and example tags. However, I am able to use some html tags like `<p>` and `<i>` in my `<summary>` XML tag to mimic what some of the other XML tags were doing. If you need more examples, visit the Microsoft Learn [Example XML documentation comments](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/xmldoc/examples) page for more example with C#. 

### Attributes

There are a variety of attributes you can leverage to provide additional enhancements to your documentation.

#### Microsoft.AspNetCore.Mvc Attributes

There are some attributes that are used to produce more descriptive response details for web API help pages generated by tools like Swagger. 

```csharp
[HttpGet]
[Route("", Name="Customers.Get")]
[ProducesResponseType(typeof(CustomerRepresentation),StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ProblemDetails),StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public IActionResult Get([FromQuery] CustomerRequest request)
```
If we use the `ProducesResponseType` attribute our Swagger output will expand. Compare this to the [screenshot above](#controller-documented) that just used the `<response>` tag in the XML comments:

![Response](/images/swagger/response.jpg)

#### System.ComponentModel and System.ComponentModel.DataAnnotations Attributes

I am sure you are familiar with using these attributes to provide validation for your API endpoints. However, Swagger also uses them to provide additional documentation for your ASP.NET Core API endpoints.

```csharp
/// <summary>
/// Customer's Status. Valid Statuses are "Active" and "Inactive".
/// </summary>
[MaxLength(10)]
[Required]
[DefaultValue("Active")]
public string Status { get; set; }
```
![Component Model](/images/swagger/componentmodel-attributes.jpg)</br>
_The endpoint UI shows us the required and default values. It also fills the default value into the parameter input box._

![Component Model in Schema](/images/swagger/componentmodel-attributes-schema.jpg)</br>
_The Schema shows us all three of our attributes._

I am sure there are additional attributes that Swagger can use to enhance your documentation, but I didn't get much further than those.

#### Swagger.AspNetCore.Annotations

Swagger has it's own [annotations package](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/tree/master/src/Swashbuckle.AspNetCore.Annotations) that can be applied to controllers, actions and models to enrich the generated Swagger. I didn't ultimately use this package because I was able to do what I wanted to do without pulling in yet another package, but check out the docs to see how you could use it in your own project.

### MicroElements.Swashbuckle.FluentValidation

On their Github page, Swagger highlights this [community open-source package](https://github.com/micro-elements/MicroElements.Swashbuckle.FluentValidation) as an alternative to using ComponentModel attributes. Since we already use FluentValidation in our projects, this seems like a win to pull into our project. However, it does have it's limitations. For instance, it doesn't support the PredicateValidator that is used by `Must`. It will also ignore rules that have a `When` condition. It is very useful for noting required properties, showing RegEx matcing patterns, displaying min and max length and a few others. I like that this is done automatically, and we don't have to worry about adding, updating, or removing attributes on properties which helps keep our documentation up to date.

## Extensibility and configuration 🛠

Swagger comes with a bunch of options to extend and configure it's functionality to provide better documentation of your endpoints. You can implement your own [IDocumentFilter](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/blob/b64b8fd6fbc7959849445be676f5e3d4a8e947bf/src/Swashbuckle.AspNetCore.SwaggerGen/XmlComments/XmlCommentsDocumentFilter.cs), [ISchemaFilter](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/blob/b64b8fd6fbc7959849445be676f5e3d4a8e947bf/src/Swashbuckle.AspNetCore.SwaggerGen/XmlComments/XmlCommentsSchemaFilter.cs), and [IOperationsFilter](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/blob/b64b8fd6fbc7959849445be676f5e3d4a8e947bf/src/Swashbuckle.AspNetCore.SwaggerGen/XmlComments/XmlCommentsOperationFilter.cs) to manipulate and extend the generated Swagger. The links are to examples of how they've been implemented in the Swagger code base. We implemented an IDocumentFilter because we have a custom type defined for some of the filter properties of our request objects. Swagger did it's best generating the UI for each custom type, but we needed to step in and help it out.

There are also lots of options when configuring Swagger during startup to do things like provide a version, title, description, contact information and more for your API itself. You can also do some custom type mapping during configuration.

See also [Swashbuckle.AspNetCore configuration and customization](https://github.com/domaindrivendev/Swashbuckle.AspNetCore?tab=readme-ov-file#configuration--customization)

## Our next steps 🚀

There is still some work to do around handling our custom type that we are using on some of our request objects. I've even gotten a few ideas for that while doing this write up! We are also starting a small, simple "Documentation Standards" policy while we are taking the time to think about documentation. Like I said at the top, we don't often document our APIs, but if this effort does extend to other APIs it might be a good idea to have some things written down so we can keep our APIs consistent.

I had to do a lot of googling to get to get these bits of information while researching how to leverage Swagger to document our ASP.NET CORE APIs. I couldn't find all of this information in one place, so if you are looking for ways to document your API with Swagger, hopefully you'll be able to save yourself some time. If there is anything I missed or stated inaccurately, please feel free to reach out to me. 👋🏻
