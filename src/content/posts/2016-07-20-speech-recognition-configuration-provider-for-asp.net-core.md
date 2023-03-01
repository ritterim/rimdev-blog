---
title: "Speech Recognition Configuration Provider For ASP.NET Core"
slug: speech-recognition-configuration-provider-for-asp.net-core
date: 2016-07-20 14:24:16
tags: 
- ASP.NET Core
- Configuration
categories: 
- ASP.NET Core
twitter_text: Speech Recognition Configuration Provider For ASP.NET Core
authors: 
- Khalid Abuhakmeh
image: https://farm4.staticflickr.com/3129/2743534799_86bcea8475_o_d.jpg
image_url: https://www.flickr.com/photos/29205886@N08/
image_credit: Patrick Breitenbach
---

The [ASP.NET Monsters](https://github.com/AspNetMonsters/SummerOfConfig) recently announced a [competition](https://github.com/AspNetMonsters/SummerOfConfig) to create configuration providers for ASP.NET Core, but they are not just looking for your grandmother's configuration provider.

> The Summer of Config is all about creating the wackiest, most insane configuration provider that you can dream up. We want you jammin' on the ASP.NET Core code, bringing us your questions, experimenting with the code and seeing your creativity. BRING IT ON!

Challenge accepted.

## Speech Configuration Provider 

The configuration provider I wrote uses the `SpeechRecognitionEngine` found in the .NET framework to transcribe audio files into text. Each audio file is added to the configuration builder and processed when `Build` is called, with the `filename` being the key and the transcription being the value.

```csharp
public Startup(IHostingEnvironment env)
{
    var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddImageFile(null, "config\\config.jpg", "config\\config.jpg.regions", false, true)
        .AddSpeech("config\\NotFoundMessage.wav", true, true)
        .AddEnvironmentVariables();

    Configuration = builder.Build();
}
```

The audio file says "This is ridiculous." Listen to it below.

<audio controls>
  <source src="https://github.com/khalidabuhakmeh/SummerOfConfig/raw/speech-recognition/src/ConfigFromAnywhere/Config/NotFoundMessage.wav" type="audio/wav">  
  Your browser does not support the audio element.
</audio>

And the results are:

![results asp.net core configuration provider speech](/images/speech-configuration-provider-aspnet-core.png)

If you'd like to try it yourself, you can go to the [GitHub repository](https://github.com/khalidabuhakmeh/SummerOfConfig/tree/speech-recognition).