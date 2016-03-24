---
layout: post
title: "Extending PATCH Support For ASP.NET WebAPI : Part II–Model Binding"
date: 2016-03-24 08:00:00
image:  
    src: https://farm5.staticflickr.com/4103/5029857600_d8ed3aaa06_b_d.jpg
    url : https://www.flickr.com/photos/khawkins04/
    credit : Ken Hawkins
tags:
- WebAPI
- ASP.NET
- REST
twitter_text: Extending PATCH Support For ASP.NET WebAPI Part II–Model Binding
authors: 
- Khalid Abuhakmeh
- Bill Boga
---

[Part I–Introduction](/extending-patch-support-for-asp.net-webapi-part-i/)
Part II–Model Binding
Part III–Validation

In [Part I](/extending-patch-support-for-asp.net-webapi-part-i/) of the series, Khalid introduced how we are using our patch library. This included mapping the request-model to the domain-model, applying validation to the request, and running the patch inside a controller-action. In Part II, I will cover how we use model binding to prep the request for validation.

## Why do we need custom model binding?

Since we are not expecting full model representation with the request, we need a way to check which properties have been sent (related to validation). Additionally, since our controller-actions use one-model, we need a way to scan both body and URI. The result is a modified form of [this Stack Overflow answer](http://stackoverflow.com/a/24846821). Two extension-points have been added where a derived class can react to bound key-values during each scan-point:

```csharp
/// <summary>
/// Bind a model to both body and URI-parameters.
/// Note: body is bound first and then URI.
/// Modified from http://stackoverflow.com/a/24846821.
/// </summary>
public class BodyAndUriParameterBinding : HttpParameterBinding
{
    public BodyAndUriParameterBinding(HttpParameterDescriptor descriptor)
        : base(descriptor)
    {
        var httpConfiguration = descriptor.Configuration;

        BodyModelValidator = httpConfiguration.Services.GetBodyModelValidator();
        Formatters = httpConfiguration.Formatters;
    }

    private readonly IBodyModelValidator BodyModelValidator;
    public event EventHandler<BoundBodyContentToModelEventArgs> BoundBodyContentToModel;
    public event EventHandler<BoundUriKeyToModelEventArgs> BoundUriKeyToModel;
    private readonly IEnumerable<MediaTypeFormatter> Formatters;
    public override bool WillReadBody => true;

    public override Task ExecuteBindingAsync(
        ModelMetadataProvider metadataProvider,
        HttpActionContext actionContext,
        CancellationToken cancellationToken)
    {
        var paramFromBody = Descriptor;
        var type = paramFromBody.ParameterType;
        var request = actionContext.ControllerContext.Request;
        var formatterLogger = new ModelStateFormatterLogger(actionContext.ModelState, paramFromBody.ParameterName);

        return ExecuteBindingAsyncCore(metadataProvider, actionContext, paramFromBody, type, request, formatterLogger, cancellationToken);
    }

    // Perf-sensitive - keeping the async method as small as possible.
    private async Task ExecuteBindingAsyncCore(
        ModelMetadataProvider metadataProvider,
        HttpActionContext actionContext,
        HttpParameterDescriptor paramFromBody,
        Type type,
        HttpRequestMessage request,
        IFormatterLogger formatterLogger,
        CancellationToken cancellationToken)
    {
        var model = await ReadContentAsync(request, type, Formatters, formatterLogger, cancellationToken);

        if (model != null)
        {
            var routeParams = actionContext.ControllerContext.RouteData.Values;

            foreach (var key in routeParams.Keys.Where(k => k != "controller"))
            {
                var prop = type.GetProperty(key, BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public);

                if (prop == null)
                {
                    continue;
                }

                var descriptor = TypeDescriptor.GetConverter(prop.PropertyType);

                if (descriptor.CanConvertFrom(typeof(string)))
                {
                    prop.SetValue(model, descriptor.ConvertFromString(routeParams[key] as string));

                    OnBoundUriKeyToObject(model, key);
                }
            }
        }

        // Set the merged model in the context.
        SetValue(actionContext, model);

        if (BodyModelValidator != null)
        {
            BodyModelValidator.Validate(model, type, metadataProvider, actionContext, paramFromBody.ParameterName);
        }
    }

    protected virtual void OnBoundBodyContentToObject(object model, Stream bodyContent)
    {
        if (BoundBodyContentToModel != null)
        {
            BoundBodyContentToModel(this, new BoundBodyContentToModelEventArgs()
            {
                Content = bodyContent,
                Model = model
            });
        }
    }

    protected virtual void OnBoundUriKeyToObject(object model, string key)
    {
        if (BoundUriKeyToModel != null)
        {
            BoundUriKeyToModel(this, new BoundUriKeyToModelEventArgs()
            {
                Key = key,
                Model = model
            });
        }
    }

    private async Task<object> ReadContentAsync(
        HttpRequestMessage request,
        Type type,
        IEnumerable<MediaTypeFormatter> formatters,
        IFormatterLogger formatterLogger,
        CancellationToken cancellationToken)
    {
        var content = request.Content;

        if (content == null)
        {
            var defaultValue = MediaTypeFormatter.GetDefaultValueForType(type);

            return defaultValue == null ? Task.FromResult<object>(null) : Task.FromResult(defaultValue);
        }

        object contentValue = null;

        using (var onReadBodyContentStream = new MemoryStream())
        {
            var contentStream = await content.ReadAsStreamAsync();
            contentStream.CopyTo(onReadBodyContentStream);
            onReadBodyContentStream.Seek(0, SeekOrigin.Begin);

            var contentString = new StreamReader(onReadBodyContentStream).ReadToEnd();

            // Gets our hydrated request-model.
            contentValue = await new StringContent(
                contentString,
                Encoding.UTF8,
                content.Headers.ContentType?.MediaType).ReadAsAsync(type, formatters, formatterLogger, cancellationToken);

            // Reset our stream so any registered-event can read.
            onReadBodyContentStream.Seek(0, SeekOrigin.Begin);

            OnBoundBodyContentToObject(contentValue, onReadBodyContentStream);
        }

        return contentValue;
    }
}

public class BoundBodyContentToModelEventArgs : EventArgs
{
    public Stream Content { get; set; }
    public object Model { get; set; }
}

public class BoundUriKeyToModelEventArgs : EventArgs
{
    public string Key { get; set; }
    public object Model { get; set; }
}
```

We use derived `EventArgs` instances for events so the implementer has relevant property-names. And, in our derived binder:

```csharp
public class PatchBinding : BodyAndUriParameterBinding
{
    public PatchBinding(HttpParameterDescriptor descriptor)
        : base(descriptor)
    {
        // Called once body has been parsed.
        BoundBodyContentToModel += (sender, eventArgs) =>
        {
            var rawContent = new StreamReader(eventArgs.Content).ReadToEnd();

            // We want **just** the values passed into the request.
            var dictionary = JObject.Parse(rawContent);

            foreach (var kvp in dictionary)
            {
                ((IPatchState)eventArgs.Model).AddBoundProperty(kvp.Key);
            }
        };

        // Called with every value in the RouteData collection.
        BoundUriKeyToModel += (sender, eventArgs) =>
        {
            ((IPatchState)eventArgs.Model).AddBoundProperty(eventArgs.Key);
        };
    }
}
```

We can get away with a direct cast to `IPatchState` since we add `PatchBinding` like this in our `WebApiConfig`:

```csharp
config.ParameterBindingRules.Insert(0, descriptor =>
    typeof(IPatchState).IsAssignableFrom(descriptor.ParameterType)
    ? new PatchBinding(descriptor)
    : null);
```

## Where do we go from here?

In Part III, we will conclude the series with an overview of validation and see how knowing which properties are part of the request comes into play. 