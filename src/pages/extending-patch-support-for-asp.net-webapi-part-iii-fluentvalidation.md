---
layout: ../layouts/Post.astro
title: "Extending PATCH Support For ASP.NET WebAPI : Part III Validation"
date: 2016-03-31 11:00:00
image: https://farm7.staticflickr.com/6141/5959689611_3b0eacf6b4_b_d.jpg
image_url: https://www.flickr.com/photos/donabelandewen/
image_credit: Ewen Roberts
tags:
- WebAPI
- ASP.NET
- REST
twitter_text: Extending PATCH Support For ASP.NET WebAPI Part III–Validation
authors: 
- Khalid Abuhakmeh
- Bill Boga
---

1. [Part I–Introduction](/extending-patch-support-for-asp.net-webapi-part-i/)
2. [Part II–Model Binding]({% post_url 2016-03-24-extending-patch-support-for-asp.net-webapi-part-ii-model-binding %})
3. Part III–Validation

In the first two parts of our series we described the general `PATCH` approach and delved into the details of our `ModelBinder`. In the final entry, we are going to show how we leveraged our `AbstractPatchStateRequest` state to understand *what* got sent to us in a request. In this post, we will leverage that information to trigger validation based on the binding information.

At Ritter Insurance Marketing, we utilize [FluentValidation](https://github.com/JeremySkinner/FluentValidation) to ensure the validity of our requests. In our opinion, it is the best way to do ASP.NET validation and we highly recommend it. FluentValidation is based on setting rules and then executing each rule over the current model. Let's recall our example validator.

```csharp
public class AddressPatchValidator : AbstractPatchValidator<AddressPatchRequest>
{
    public AddressPatchValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        WhenBound(x => x.City, rule => rule.NotEmpty());
        WhenBound(x => x.IsPrimary, rule => rule.NotEmpty());
        WhenBound(x => x.StateAbbreviation, rule => rule.NotEmpty());
        WhenBound(x => x.Street1, rule => rule.NotEmpty());
        WhenBound(x => x.Type, rule => rule.NotEmpty());
        WhenBound(x => x.ZipCode, rule => rule.NotEmpty());
    }
}
```

We are inheriting from `AbstractPatchValidator` which affords us access to the `WhenBound` structure. `WhenBound` will **only** execute the rule if the parameter was passed to our endpoint. Here is the actual implementation.

```csharp
public abstract class AbstractPatchValidator<T> : AbstractValidator<T>
    where T : IPatchState<T>
{
    public void WhenBound<TProperty>(
        Expression<Func<T, TProperty>> propertyExpression,
        Action<IRuleBuilderInitial<T, TProperty>> action)
    {
        When(x => x.IsBound(propertyExpression), () => action(RuleFor(propertyExpression)));
    }
}
```

Simple yet powerful. The generic parameter is constrained to `IPatchState<T>`, which allows us to access `IsBound` from our request. In addition to having access to `WhenBound`, we still have access to **all** the capabilities of FluentValidation. The existing capabilities of FluentValidation allow us to write complex rules when necessary that go beyond just validating the state of the request, but also the state of our system.

## Conclusion

Combining all three posts, we can create a simple yet productive approach to handling `PATCH` requests in our ASP.NET WebAPI applications. We also get a consistent approach that doesn't add bloat to our controllers. Finally, we get to use our validation framework of choice. We hope you enjoyed this series, and if you have any questions, please feel free to leave a comment.

## Update

As reader **Brett M** pointed out, we forgot to include the `AbstractPatchStateRequest` model in our series. So here it is. Sorry about that oversight, and thank you for reading.

```csharp
public abstract class AbstractPatchStateRequest<TRequest, TModel> : IPatchState<TRequest, TModel>, IPatchState<TRequest>, IPatchState
    where TRequest : class, IPatchState<TRequest, TModel>, new()
{
    protected readonly IList<string> boundProperties = new List<string>();
    private BindingFlags bindingFlags = BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public;
    protected readonly IDictionary<string, Action<TModel>> patchStateMapping =
        new Dictionary<string, Action<TModel>>(StringComparer.InvariantCultureIgnoreCase);

    public void AddBoundProperty(string propertyName)
    {
        if (!boundProperties.Contains(propertyName, StringComparer.InvariantCultureIgnoreCase))
        {
            boundProperties.Add(propertyName);
        }
    }

    public TRequest AddPatchStateMapping<TProperty, TModelProperty>(
        Expression<Func<TRequest, TProperty>> propertyExpression,
        Expression<Func<TModel, TModelProperty>> modelMapping)
    {
        var propertyName = GetPropertyName(propertyExpression);

        var instanceProperty = GetType().GetProperty(propertyName, bindingFlags);

        Action<TModel> mappingAction = (model) =>
        {

            BuildActionFromExpression(modelMapping)(model, (TModelProperty)instanceProperty.GetValue(this, null));
        };

        AddPatchStateMapping(propertyExpression, mappingAction);

        return this as TRequest;
    }

    public TRequest AddPatchStateMapping<TProperty>(
        Expression<Func<TRequest, TProperty>> propertyExpression,
        Action<TModel> propertyToModelMapping = null)
    {
        var propertyName = GetPropertyName(propertyExpression);

        if (propertyToModelMapping == null)
        {
            propertyToModelMapping = (model) =>
            {
                var modelProperty = model.GetType().GetProperty(propertyName, bindingFlags);

                var instanceProperty = GetType().GetProperty(propertyName, bindingFlags);

                if (modelProperty != null && instanceProperty != null)
                {
                    modelProperty.SetValue(model, instanceProperty.GetValue(this, null), null);
                }
            };
        }

        if (patchStateMapping.ContainsKey(propertyName))
        {
            patchStateMapping[propertyName] = propertyToModelMapping;
        }
        else
        {
            patchStateMapping.Add(propertyName, propertyToModelMapping);
        }

        return this as TRequest;
    }

    private Action<TObject, TProperty> BuildActionFromExpression<TObject, TProperty>(
        Expression<Func<TObject, TProperty>> accessor)
    {
        if (accessor == null)
            throw new ArgumentNullException(nameof(accessor));

        var memberExpression = accessor.Body as MemberExpression;

        var memberInfo = memberExpression?.Member;
        if (!(memberInfo is PropertyInfo) && !(memberInfo is FieldInfo))
            throw new InvalidOperationException("Member is not a property or field");

        var valueParameter = Expression.Parameter(typeof(TProperty), "val");
        var assignmentExpression = Expression.Assign(memberExpression, valueParameter);
        var lambdaExpression =
            Expression.Lambda<Action<TObject, TProperty>>(
                assignmentExpression,
                accessor.Parameters[0],
                valueParameter);

        return lambdaExpression.Compile();
    }

    private string GetPropertyName<TProperty>(Expression<Func<TRequest, TProperty>> propertyExpression)
    {
        var propertyBody = propertyExpression.Body as MemberExpression;

        if (propertyBody == null)
        {
            throw new InvalidCastException($"Cannot get property name from {nameof(propertyExpression)}.");
        }
        else
        {
            var fullPropertyName = propertyBody.ToString();

            return fullPropertyName.Substring(fullPropertyName.IndexOf('.') + 1);
        }
    }

    public bool IsBound<TProperty>(Expression<Func<TRequest, TProperty>> propertyExpression)
    {
        var propertyName = GetPropertyName(propertyExpression);

        return boundProperties.Contains(propertyName, StringComparer.InvariantCultureIgnoreCase);
    }

    public void Patch(TModel model)
    {
        foreach (var kvp in patchStateMapping)
        {
            if (boundProperties.Contains(kvp.Key, StringComparer.InvariantCultureIgnoreCase))
            {
                kvp.Value(model);
            }
        }
    }
}
```

## Update 2016-10-11

To finish out the available code to make everything work, here are the patch-related interfaces:

```csharp
public interface IPatchState<TRequest, TModel>
    where TRequest : class, IPatchState<TRequest, TModel>, new()
{
    TRequest AddPatchStateMapping<TProperty>(
        Expression<Func<TRequest, TProperty>> propertyExpression,
        Action<TModel> propertyToModelMapping = null);
    void Patch(TModel model);
}

public interface IPatchState<TRequest>
{
    bool IsBound<TProperty>(Expression<Func<TRequest, TProperty>> propertyExpression);
}

public interface IPatchState
{
    void AddBoundProperty(string propertyName);
}
```
