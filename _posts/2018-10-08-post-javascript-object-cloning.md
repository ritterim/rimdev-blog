---
layout: post
title: "JavaScript Object Cloning"
date: 2018-10-08 08:00:39
tags:
- JavaScript
categories:
- JavaScript
twitter_text: "Easily clone objects in JavaScript"
authors: Andrew Rady 
image: 
image_url:
image_credit:
---
In JavaScript we are always working with different data types to send to the api or display on the UI. Cloning and altering that clone is a very common thing we do every day. Sometimes we only want to alter the new cloned data without effect the original data. For example, we can copy an array alter the new one and everything works out fine.

```javascript
Let originalArray = [1,2,3,4];
Let newArray = originalArray;
newArray.push(5)

console.log(originalArray)
[1,2,3,4]

console.log(newArray)
[1,2,3,4,5]
```

As you can see we can alter the newArray and push the integer of 5 in without altering the originalArray. This is nothing new and is covered for a basic of JavaScript. There can be a basic gotcha when we need to clone objects. For this example, we are going to imagine we have an array of objects from the api. We want to display that data and all filtering is going to be only UI filtering. The idea is to take input from the user, clone the original array we got from the api and apply the filters without altering the original array. This is where deep cloning and shallowing cloning comes in.  Below is way to “clone” this array.

```javascript
Let clientList = [
  “description”: List of clients”,
  {
    "firstName": "Chuck",
    "lastName": "Norris",
    "address": "1600 Pennsylvania Ave NW",
    "city": "Washington",
    "state": "DC",
    "zip": "20500"
  },
  {
    "firstName": "John",
    "lastName": "Snow",
    "address": "",
    "city": "",
    "state": "",
    "zip": ""
  },
  {
    "firstName": "Micky",
    "lastName": "Mouse",
    "address": "1313 Disneyland Dr",
    "city": "Anaheim",
    "state": "CA",
    "zip": "92802"
  }
]

let filteredList = clientList
```

Now if we alter an object our new copy `filteredList` array it is going to also change the original array of clientList. 

```javascript
filteredList.[0].firstName= “Billy”;

console.log(fliteredList)
firstName: “Billy”
console.log(clientList)
firstName: “Billy”
```

Why is this happening? Well this happens because we assign an array with object into a new array like above we are only shallow cloning the objects. Instead of copying the objects into the new array we are only copying a reference back to the original object and therefore you will see the changes in both arrays. This can be an issue if we want to keep the integrity of the original api response object. 

## Easy and simple

If you are unable to use the newer es6 standard, we can still deep clone this array. We are going to use `JSON.parse` and `JSON.stringify`

```javascript
Let filteredList = JSON.parse(JSON.stringify(clientList));

filteredList.[0].firstName= “Billy”;

console.log(fliteredList)
firstName: “Billy”
console.log(clientList)
firstName: “Chuck”
```

Both can help us copy arrays of data the is returned from more complex api calls and alter them while keeping the integrity of the original one. 
