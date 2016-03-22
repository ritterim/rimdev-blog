When it comes to HTTP verbs, there is no verb more controversial than `PATCH`. How, when, and why to use this verb is up to each implementor. In addition to being controversial, it is often overlooked as an option for ASP.NET developers due to a lack of consistent approach in the ASP.NET WebAPI framework. What is `PATCH`, and what does a client expect the behavior to be? 

> The HTTP methods PATCH can be used to update partial resources. For instance, when you only need to update one field of the resource, PUTting a complete resource representation might be cumbersome and utilizes more bandwidth
> -- [REST Cookbook](http://restcookbook.com/HTTP%20Methods/patch/)

 While building our newest APIs, we came up with use cases, not mentioned here; that could benefit from the `PATCH` command. We quickly realized that it would be cumbersome to write every occurrence of `PATCH` behavior, and we weren't gluttons for punishment. We took a step back and started thinking about how to implement an approach on top of ASP.NET WebAPI:

1. We want the procedure to be repeatable regardless of the request.
2. We want to hook into the ASP.NET WebAPI pipeline.
3. We need to know *which* properties were *"bound"*.
4. We wanted to leverage the *"bound"* knowledge to execute selectively our validation (powered by [FluentValidation](https://github.com/JeremySkinner/FluentValidation)) and `Patch` mapping.
5. Keep our controller actions thin.

## Basic Implementation

While we will follow this post up with actual implementation details on **how** we accomplished our `PATCH` approach; I'd like to show you how it ultimately looks in our code base.

Let's start with the controller action.

```csharp
[HttpPut]
public IHttpActionResult Patch(AddressPatchRequest request) 
{
    var address = db.Addresses.Find(request.Id);
    
    if (address == null)
        return NotFound();
        
    request.Patch(address);
    db.SaveChanges();

    return Ok(new AddressUpdateResponse(address));
}
```

The first thing to note is that we have a very *skinny* controller action. No verbose `if` statements or complex logic; just a simple call to `Patch`. What does `AddressPatchRequest` look like as an incoming request?

```csharp
public class AddressPatchRequest : AbstractPatchStateRequest<AddressPatchRequest, Address>
{
    public AddressPatchRequest()
    {
        AddPatchStateMapping(x => x.City);
        AddPatchStateMapping(x => x.IsPrimary);
        AddPatchStateMapping(x => x.StateAbbreviation);
        AddPatchStateMapping(x => x.Street1);
        AddPatchStateMapping(x => x.Street2);
        AddPatchStateMapping(x => x.Type);
        AddPatchStateMapping(x => x.ZipCode);
    }

    public int Id { get; set; }
    public string City { get; set; }
    public bool? IsPrimary { get; set; }
    public string StateAbbreviation { get; set; }
    public string Street1 { get; set; }
    public string Street2 { get; set; }
    public string Type { get; set; }
    public string ZipCode { get; set; }
}
```

Our request inherits from `AbstractPatchStateRequest`, which understands our *mapping* target. In the request constructor, we can map from our request to the destination. The target mapping only occurs when an actual property is bound, and `Patch` is called. Validation is also only triggered on properties that were bound at the time of the request. Let's take a look at our validator.

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

Our approach meets the requirements described earlier while also giving team members a familiar and understandable approach to implementing a confusing feature. The question we asked ourselves was "why isn't this just baked into ASP.NET WebAPI?!" Granted our approach is opinionated and utilizes a third party library, but we still love it. 

Thanks to Bill Boga and Justin Rusbatch for working out the issues required to make this a reality. Stay tuned for Part II, where Bill Boga will go into making the ModelBinder work with our `AbstractPatchStateRequest` base class.