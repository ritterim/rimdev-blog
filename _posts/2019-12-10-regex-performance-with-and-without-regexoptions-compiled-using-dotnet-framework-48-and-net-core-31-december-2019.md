---
layout: post
title: "Regex Performance With and Without RegexOptions.Compiled Using .NET Framework 4.8 and .NET Core 3.1 (December 2019)"
date: 2019-12-10 10:30:00
tags:
- .NET
categories:
- development
twitter_text: "Regex Performance With and Without RegexOptions.Compiled Using .NET Framework 4.8 and .NET Core 3.1 (December 2019)"
authors: Ken Dale
image: https://images.unsplash.com/photo-1501290301209-7a0323622985?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3MzYxfQ&auto=format&fit=crop&w=1000&q=80
image_url: https://unsplash.com/photos/dPgPoiUIiXk
image_credit: Robin Pierre
---

We've had some internal discussion around the usage of [`RegexOptions.Compiled`](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.regexoptions?view=netframework-4.8#fields) in .NET -- how it works and when it's appropriate to use it. Despite being named *`Compiled`* is isn't compiled at build time, it's a runtime optimization for repeated use of a regex. And, it's backed by a cache that has a default limit of 15. You can read more about this here: [https://docs.microsoft.com/en-us/dotnet/standard/base-types/compilation-and-reuse-in-regular-expressions](https://docs.microsoft.com/en-us/dotnet/standard/base-types/compilation-and-reuse-in-regular-expressions).

That said, what are the performance characteristics of *normal* and compiled regular expressions on .NET Framework 4.8 and .NET Core 3.1?

## Benchmark results

[https://github.com/kendaleiv/dotnet-regex-benchmarks#results](https://github.com/kendaleiv/dotnet-regex-benchmarks#results)

```
BenchmarkDotNet=v0.12.0, OS=Windows 10.0.18362
Intel Core i7-8550U CPU 1.80GHz (Kaby Lake R), 1 CPU, 8 logical and 4 physical cores
.NET Core SDK=3.1.100
  [Host]        : .NET Core 3.1.0 (CoreCLR 4.700.19.56402, CoreFX 4.700.19.56404), X64 RyuJIT
  .NET Core x64 : .NET Core 3.1.0 (CoreCLR 4.700.19.56402, CoreFX 4.700.19.56404), X64 RyuJIT
  LegacyJitX86  : .NET Framework 4.8 (4.8.4042.0), X86 LegacyJIT
  RyuJitX64     : .NET Framework 4.8 (4.8.4042.0), X64 RyuJIT
```

### Single

![Single barplot](https://raw.githubusercontent.com/kendaleiv/dotnet-regex-benchmarks/eac095eb3e6cfcaae32b86578d21854fc5898e7f/BenchmarkDotNet.Artifacts/results/dotnet_regex_benchmarks.Single-barplot.png){: .img-fluid .border }

<table>
<thead><tr><th>Method</th><th>    Job</th><th>Jit</th><th>Platform</th><th>Toolchain</th><th>  Mean</th><th>Error</th><th>StdDev</th><th>Gen 0</th><th>Gen 1</th><th>Gen 2</th><th>Allocated</th>
</tr>
</thead><tbody><tr><td>Normal</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>1.799 us</td><td>0.0360 us</td><td>0.0658 us</td><td>0.7629</td><td>-</td><td>-</td><td>3.12 KB</td>
</tr><tr><td>Compiled</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>1,134.949 us</td><td>6.3422 us</td><td>5.6222 us</td><td>1.9531</td><td>-</td><td>-</td><td>12.69 KB</td>
</tr><tr><td>Normal</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>2.380 us</td><td>0.0472 us</td><td>0.0505 us</td><td>0.7172</td><td>-</td><td>-</td><td>2.94 KB</td>
</tr><tr><td>Compiled</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>631.919 us</td><td>9.4512 us</td><td>8.8406 us</td><td>1.9531</td><td>0.9766</td><td>-</td><td>9.41 KB</td>
</tr><tr><td>Normal</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>2.076 us</td><td>0.0144 us</td><td>0.0112 us</td><td>1.1139</td><td>-</td><td>-</td><td>4.57 KB</td>
</tr><tr><td>Compiled</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>1,167.988 us</td><td>22.9845 us</td><td>34.4021 us</td><td>1.9531</td><td>-</td><td>-</td><td>14.37 KB</td>
</tr></tbody></table>

### 1,000

![1,000 barplot](https://raw.githubusercontent.com/kendaleiv/dotnet-regex-benchmarks/eac095eb3e6cfcaae32b86578d21854fc5898e7f/BenchmarkDotNet.Artifacts/results/dotnet_regex_benchmarks._1000-barplot.png){: .img-fluid .border }

<table>
<thead><tr><th>Method</th><th>    Job</th><th>Jit</th><th>Platform</th><th>Toolchain</th><th>Mean</th><th>Error</th><th>StdDev</th><th>Median</th><th>Gen 0</th><th>Gen 1</th><th>Gen 2</th><th>Allocated</th>
</tr>
</thead><tbody><tr><td>Normal</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>174.0 us</td><td>3.47 us</td><td>7.61 us</td><td>171.0 us</td><td>50.2930</td><td>-</td><td>-</td><td>206.04 KB</td>
</tr><tr><td>Compiled</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>2,039.4 us</td><td>40.86 us</td><td>114.59 us</td><td>2,038.8 us</td><td>52.7344</td><td>1.9531</td><td>-</td><td>215.63 KB</td>
</tr><tr><td>Normal</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>282.0 us</td><td>10.30 us</td><td>30.06 us</td><td>269.0 us</td><td>30.2734</td><td>-</td><td>-</td><td>124.09 KB</td>
</tr><tr><td>Compiled</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>1,000.6 us</td><td>20.06 us</td><td>28.12 us</td><td>999.3 us</td><td>31.2500</td><td>-</td><td>-</td><td>130.78 KB</td>
</tr><tr><td>Normal</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>250.2 us</td><td>9.52 us</td><td>27.92 us</td><td>256.2 us</td><td>50.7813</td><td>-</td><td>-</td><td>208.09 KB</td>
</tr><tr><td>Compiled</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>1,361.3 us</td><td>25.39 us</td><td>26.07 us</td><td>1,369.7 us</td><td>52.7344</td><td>1.9531</td><td>-</td><td>218.27 KB</td>
</tr></tbody></table>

### 100,000

![100,000 barplot](https://raw.githubusercontent.com/kendaleiv/dotnet-regex-benchmarks/eac095eb3e6cfcaae32b86578d21854fc5898e7f/BenchmarkDotNet.Artifacts/results/dotnet_regex_benchmarks._100000-barplot.png){: .img-fluid .border }

<table>
<thead><tr><th>Method</th><th>    Job</th><th>Jit</th><th>Platform</th><th>Toolchain</th><th>Mean</th><th>Error</th><th>StdDev</th><th>Gen 0</th><th>Gen 1</th><th>Gen 2</th><th>Allocated</th>
</tr>
</thead><tbody><tr><td>Normal</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>17.08 ms</td><td>0.341 ms</td><td>0.466 ms</td><td>4968.7500</td><td>-</td><td>-</td><td>19.84 MB</td>
</tr><tr><td>Compiled</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>16.94 ms</td><td>0.245 ms</td><td>0.229 ms</td><td>4968.7500</td><td>-</td><td>-</td><td>19.85 MB</td>
</tr><tr><td>Normal</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>20.29 ms</td><td>0.402 ms</td><td>0.683 ms</td><td>2937.5000</td><td>-</td><td>-</td><td>11.85 MB</td>
</tr><tr><td>Compiled</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>17.47 ms</td><td>0.345 ms</td><td>0.751 ms</td><td>2937.5000</td><td>31.2500</td><td>-</td><td>11.85 MB</td>
</tr><tr><td>Normal</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>19.45 ms</td><td>0.379 ms</td><td>0.673 ms</td><td>4968.7500</td><td>-</td><td>-</td><td>19.9 MB</td>
</tr><tr><td>Compiled</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>16.07 ms</td><td>0.319 ms</td><td>0.777 ms</td><td>4968.7500</td><td>-</td><td>-</td><td>19.91 MB</td>
</tr></tbody></table>

### 1,000,000

![1,000,000 barplot](https://raw.githubusercontent.com/kendaleiv/dotnet-regex-benchmarks/eac095eb3e6cfcaae32b86578d21854fc5898e7f/BenchmarkDotNet.Artifacts/results/dotnet_regex_benchmarks._1000000-barplot.png){: .img-fluid .border }

<table>
<thead><tr><th>Method</th><th>    Job</th><th>Jit</th><th>Platform</th><th>Toolchain</th><th>Mean</th><th>Error</th><th>StdDev</th><th>Median</th><th>Gen 0</th><th>Gen 1</th><th>Gen 2</th><th>Allocated</th>
</tr>
</thead><tbody><tr><td>Normal</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>170.3 ms</td><td>6.86 ms</td><td>8.17 ms</td><td>166.6 ms</td><td>49500.0000</td><td>-</td><td>-</td><td>198.37 MB</td>
</tr><tr><td>Compiled</td><td>.NET Core x64</td><td>RyuJit</td><td>X64</td><td>.NET Core x64</td><td>145.0 ms</td><td>2.86 ms</td><td>6.50 ms</td><td>144.0 ms</td><td>49500.0000</td><td>-</td><td>-</td><td>198.38 MB</td>
</tr><tr><td>Normal</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>203.5 ms</td><td>4.02 ms</td><td>6.60 ms</td><td>202.3 ms</td><td>29333.3333</td><td>-</td><td>-</td><td>118.43 MB</td>
</tr><tr><td>Compiled</td><td>LegacyJitX86</td><td>LegacyJit</td><td>X86</td><td>net48</td><td>173.8 ms</td><td>3.36 ms</td><td>4.93 ms</td><td>172.5 ms</td><td>29500.0000</td><td>-</td><td>-</td><td>118.44 MB</td>
</tr><tr><td>Normal</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>207.7 ms</td><td>4.46 ms</td><td>13.07 ms</td><td>203.7 ms</td><td>49666.6667</td><td>-</td><td>-</td><td>198.95 MB</td>
</tr><tr><td>Compiled</td><td>RyuJitX64</td><td>RyuJit</td><td>X64</td><td>net48</td><td>141.9 ms</td><td>1.92 ms</td><td>1.80 ms</td><td>142.2 ms</td><td>49500.0000</td><td>-</td><td>-</td><td>198.96 MB</td>
</tr></tbody></table>

## Conclusion

Using a compiled regex for a single result is a performance burden. Using a compiled regex as a performance optimization doesn't make sense until you're matching it many times *(at least on the hardware described by this benchmark)*. With performance optimizations ideally one measures to ensure performance is improved and by how much. And, don't forget to consider the cache size if you're using compiled regex.

The benchmark is at [https://github.com/kendaleiv/dotnet-regex-benchmarks](https://github.com/kendaleiv/dotnet-regex-benchmarks) if you'd like to try it out yourself.
