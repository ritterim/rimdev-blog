---
title: "Automating Stripe Exports via PowerShell"
slug: automating-stripe-exports-via-powershell
date: 2016-02-16 13:36:15
description:
tags:
- PowerShell
- Stripe
- Automation
categories:
twitter_text: "Automating Stripe Exports via PowerShell"
authors: 
- Ken Earl
---

### PowerShell and Stripe

I'll be completely honest in admitting that I've never done much of anything in [PowerShell](https://technet.microsoft.com/library/bb978526.aspx) before, but I've always loved delving into new things. I was asked nicely by my team member, Stewart, to extract data from our corporate [Stripe](https://stripe.com/) account and I took it as a Powershell learning opportunity while meeting the needs of our business.  While I've dealt with the Stripe API a decent amount, the actual Stripe API part of what I had to do was minimal.  Most of the project had to do with getting PowerShell pointed in the right direction.  I was told that people were currently going through a complicated manual process to get Stripe's data in CSV format.  It was then being imported into SQL Server so that they could run various reports against it.  The data needed was simple, just the customer information and the payment information. 

###  Retrieving Data

I decided the first thing to do was figure out how to retrieve the needed data in PowerShell.  It turned out to be quite simple thanks to the [`Invoke-WebRequest`](https://technet.microsoft.com/en-us/library/hh849901.aspx) Cmdlet. In about 10 minutes I had a JSON printout of the customer information from our Stripe test API.  The code went something like this:

```powershell
$uri = 'https://api.stripe.com/v1/customers'
$key = '<stripe API private key>'

$authVal = 'Basic ' + `
    [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($key))

$response = Invoke-WebRequest -Uri $uri -Headers @{'AUTHORIZATION'=$authVal}
```

I had originally tried using a [`PSCredential`](https://msdn.microsoft.com/en-us/library/ms572524(v=VS.85).aspx) object passed in with the `-Credential` flag.  It failed to authenticate, and popped up a windows credentials dialog asking for a valid username/password.  For basic authentication like Stripe uses, you need to create the header manually as I did in the above example.  The Stripe API simply takes the private API key as the username, and there is no password.  At this point, I was able to print out the JSON retrieved by doing a quick `echo $response.Content`.

### CSV and JSON
In PowerShell, it is dead simple to convert from a JSON string into a native PowerShell object.  There is a Cmdlet to do this for you, [`ConvertFrom-Json`](https://technet.microsoft.com/en-us/library/hh849898.aspx) which works great.

PowerShell has a couple different handy commands to output CSV formatted information. One is [`ConvertTo-Csv`](https://technet.microsoft.com/en-us/library/hh849878.aspx) which will take an object, and give back a string in CSV format. The other is [`Export-Csv`](https://technet.microsoft.com/en-us/library/hh849932.aspx) which will take the same input, but outputs the CSV into a file which you can specify.  Both of these options will return the first line of the CSV as the type of the object, unless you pass in the `-NoTypeInformation` flag.  These Cmdlets will take an object, and put the properties of that object into a CSV format.  The property names will be the column headings, and the property values will be the column values.  

Before knowing this, you might think that you can give it a hashtable and have it put that into a CSV format.  A hashtable is really just a list of key/value pairs, right?  If you give it a hashtable, you'll get a list of the properties of the hashtable.  Things like `IsReadOnly`, `IsFixedSize`, and `IsSynchronized` with their respective values.  After a bit of trial and error, I found that if you want a good CSV file, you need to create a collection of objects.  Each must have exactly the same structure of property names and values.  I'm getting JSON back from the Stripe API, which is hierarchical data, and what I need for the CSV file is flat data.  To construct the JSON data into the required structure, I created a simple function that I could pass the JSON object into.  It gives back a properly formatted collection of objects.

```powershell
function flattenObject ($jsonCustomers) {
        
	$customers = @()
	
	foreach($jsonCustomer in $jsonCustomers) {
		$customer = New-Object system.object
		$customer | Add-Member `
			-MemberType NoteProperty `
			-Name 'id' `
			-Value $jsonCustomer.id
		$customer | Add-Member `
			-MemberType NoteProperty `
			-Name 'Description' `
			-Value $jsonCustomer.description
		$customer | Add-Member `
			-MemberType NoteProperty `
			-Name 'Email' `
			-Value $jsonCustomer.email
            
        #code removed for brevity
        
		foreach($paymentSource in $jsonCustomer.sources.data) {
			if ($jsonCustomer.default_source -eq $paymentSource.id) {
				$customer | Add-Member `
					-MemberType NoteProperty `
					-Name 'Card ID' `
					-Value $paymentSource.id
				$customer | Add-Member `
					-MemberType NoteProperty `
					-Name 'Card Last4' `
					-Value $paymentSource.last4
                    
                #code removed for brevity
            
			}
		}
		foreach($subscription in $jsonCustomer.subscriptions.data) {
			if ($subscription.plan.id -eq 1) {
				$customer | Add-Member `
					-MemberType NoteProperty `
					-Name 'Plan' `
					-Value $subscription.plan.id
				$customer | Add-Member `
					-MemberType NoteProperty `
					-Name 'Status' `
					-Value $subscription.status
				$customer | Add-Member `
					-MemberType NoteProperty `
					-Name 'Cancel At Period End' `
					-Value $subscription.cancel_at_period_end
			}
		}
		
		$customers += $customer
		rv customer
	}
	
	return $customers
}
```
This worked as I wanted it to.  It put the customer card and subscription information into the flat format needed. I couldn't help but cringe at the long-winded format and all the repetitive declarations. It was the same thing for each new property.  It didn't take long to find the shorthand method of adding properties.  It was introduced in PowerShell 2.  When you create a new object, you can pass it a hashtable as the list of properties.  After switching over to this new method, the code was more readable.

```powershell
function flattenObject ($jsonCustomers) {
        
	$customers = @()
	
	foreach($jsonCustomer in $jsonCustomers) {
		$customerProperties = @{}
		$customerProperties.id = $jsonCustomer.id
		$customerProperties.Description = $jsonCustomer.description
		$customerProperties.Email = $jsonCustomer.email
        
        # code removed for brevity

		foreach($paymentSource in $jsonCustomer.sources.data) {
			if ($jsonCustomer.default_source -eq $paymentSource.id) {
				$customerProperties['Card ID'] = $paymentSource.id
				$customerProperties['Card Last4'] = $paymentSource.last4
                
                #code removed for brevity
                
			}
		}
		foreach($subscription in $jsonCustomer.subscriptions.data) {
			if ($subscription.plan.id -eq 1) {
				$customerProperties.Plan = $subscription.plan.id
				$customerProperties.Status = $subscription.status
				$customerProperties['Cancel At Period End'] = `
                    $subscription.cancel_at_period_end
			}
		}
		$customers += New-Object PSObject -Prop $customerProperties
	}
	return $customers
}
```

I chose column names based on the current manually exported CSV to minimize impact. 
I started looking at the actual data I was getting back, and realized there was not nearly enough of it to be correct.  After a bit of looking, I found that Stripe will return a maximum of 100 records per request. I would need to do some sort of internal paging here to get the whole burrito.  By default, it doesn't even return the 100, so I needed to add that as well.  Stripe provides information with their JSON responses to help with exactly what I needed.  First, they give back a `has_more` property. This helps me know if this is the end, or if there are more records after the end of the current list.  Next, I can pass in a `starting_after` ID, made exactly for this purpose.  Utilizing these, along with the `limit` flag, here is what I came up with to get all the records into one list.

```powershell

$baseUri = 'https://api.stripe.com/v1/customers?limit=100'
$uri = $baseUri
$key = '<stripe API private key>'

$authVal = 'Basic ' + `
    [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($key))

do {
	$response = Invoke-WebRequest -Uri $uri -Headers @{'AUTHORIZATION'=$authVal}
	$jsonCustomers = $response.Content | ConvertFrom-Json
	$customersObject += flattenObject($jsonCustomers.data)
	$lastId = $jsonCustomers.data[-1].id
	$uri = $baseUri + '&starting_after=' + $lastId
} while ($jsonCustomers.has_more)
```

At this point, I handed it over, to be tested in the automation script as part of a SQL Server job.  The script failed on this line:

```powershell

$response = Invoke-WebRequest -Uri $uri -Headers @{'AUTHORIZATION'=$authVal}
```
After some discussion, it shocked me to find out that the built in PowerShell for SQL Server is only version 2.  There is a way to use a higher version, but it requires spinning up a PowerShell instance within the host operating system.  Since we are hosting SQL Server on Azure, we do not have that option.  

I looked into the [`Invoke-WebRequest`](https://technet.microsoft.com/en-us/library/hh849901.aspx) Cmdlet.  It was introduced in PowerShell version 3.  PowerShell version 2 does not really have a convenient way to work with web requests.  One nice thing about PowerShell, is that it has access to virtually the entire .NET framework.  This makes it very powerful.  After much trial and error, I was able to use the [`System.Net.WebRequest`](https://msdn.microsoft.com/en-us/library/system.net.webrequest(v=vs.110).aspx) .NET object. That got it done by replacing a single line, with the following:

```powershell

$webRequest = [System.Net.WebRequest]::Create($uri)
$webRequest.ContentType = 'application/json'
$webRequest.Headers.Add('AUTHORIZATION', $authVal)
$webRequest.Method = 'GET'
$responseStream = ($webRequest.GetResponse()).GetResponseStream()
$streamReader = New-Object System.IO.StreamReader -ArgumentList $responseStream

$jsonCustomers = $streamReader.ReadToEnd() | ConvertFrom-Json
```

In the end, this worked in the SQL Server job, and seemed to satisfy all involved. 
PowerShell was more powerful than I had originally thought, which turned out to be nice.

Here is the finished script in full.

```powershell
function flattenObject ($jsonCustomers) {
        
	$customers = @()
	
	foreach($jsonCustomer in $jsonCustomers) {
		$customerProperties = @{}
		$customerProperties.id = $jsonCustomer.id
		$customerProperties.Description = $jsonCustomer.description
		$customerProperties.Email = $jsonCustomer.email
		$customerProperties.Created = $jsonCustomer.created
		$customerProperties.Delinquent = $jsonCustomer.delinquent
		$customerProperties["Account Balance"] = $jsonCustomer.account_balance
		foreach($paymentSource in $jsonCustomer.sources.data) {
			if ($jsonCustomer.default_source -eq $paymentSource.id) {
				$customerProperties['Card ID'] = $paymentSource.id
				$customerProperties['Card Last4'] = $paymentSource.last4
				$customerProperties['Card Brand'] = $paymentSource.brand
				$customerProperties['Card Funding'] = $paymentSource.funding
				$customerProperties['Card Exp Month'] = $paymentSource.exp_month
				$customerProperties['Card Exp Year'] = $paymentSource.exp_year
				$customerProperties['Card Name'] = $paymentSource.name
				$customerProperties['Card Name'] = $paymentSource.name
				$customerProperties['Card Address Line1'] = `
                    $paymentSource.address_line1
				$customerProperties['Card Address Line2'] = `
                    $paymentSource.address_line2
				$customerProperties['Card Address City'] = `
                    $paymentSource.address_city
				$customerProperties['Card Address Country'] = `
                    $paymentSource.address_country
				$customerProperties['Card Address State'] = `
                    $paymentSource.address_state
				$customerProperties['Card Address Zip'] = $paymentSource.address_zip
				$customerProperties['Card Issue Country'] = $paymentSource.country
				$customerProperties['Card Fingerprint'] = $paymentSource.fingerprint
				$customerProperties['Card CVC Status'] = $paymentSource.cvc_check
			}
		}
		foreach($subscription in $jsonCustomer.subscriptions.data) {
			if ($subscription.plan.id -eq 1) {
				$customerProperties.Plan = $subscription.plan.id
				$customerProperties.Status = $subscription.status
				$customerProperties['Cancel At Period End'] = `
                    $subscription.cancel_at_period_end
			}
		}
		$customers += New-Object PSObject -Prop $customerProperties
	}
	return $customers
}

$baseUri = 'https://api.stripe.com/v1/customers?limit=100'
$uri = $baseUri
$key = '<stripe API private key>'
$authVal = 'Basic ' + `
    [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($key))

do {
	$webRequest = [System.Net.WebRequest]::Create($uri)
	$webRequest.ContentType = 'application/json'
	$webRequest.Headers.Add('AUTHORIZATION', $authVal)
	$webRequest.Method = 'GET'
	$responseStream = ($webRequest.GetResponse()).GetResponseStream()
	$streamReader = New-Object System.IO.StreamReader -ArgumentList $responseStream
	
	$jsonCustomers = $streamReader.ReadToEnd() | ConvertFrom-Json
	$customersObject += flattenObject($jsonCustomers.data)
	$lastId = $jsonCustomers.data[-1].id
	$uri = $baseUri + '&starting_after=' + $lastId
} while ($jsonCustomers.has_more)

$customersObject | Export-Csv -Path 'C:\Test\StripeCustomers.csv' -NoTypeinformation
rv customersObject
```