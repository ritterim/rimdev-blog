---
title: "JavaScript Array Cloning: Objects vs Primitives"
slug: post-javascript-object-cloning
date: 2018-10-08 08:00:39
tags:
- JavaScript
categories:
- JavaScript
twitter_text: "JavaScript Array Cloning: Objects vs Primitives"
authors: 
- Andrew Rady 
image: https://farm1.staticflickr.com/662/33187648151_1d955c27f8_b.jpg
image_url: https://www.flickr.com/photos/144219502@N04/33187648151/in/photolist-SyFnyc-kwoER4-5JfofT-74J7Tr-93v3Uu-qnMB76-2k6wVZ-hkgDQn-s6ny87-bo5sQU-po3Gcn-avBpY7-agqKqj-onWNK4-asuj8-dV54t7-cDCYSN-qbpekY-qvG8sd-vdB6e-e391ip-4rZG52-vsmwxr-dK52hk-aispHU-7k8waH-fEwnAz-e6msZV-pUg4DB-7fc36Q-mQZiPR-311nS6-qQ13Vj-mkGPf2-AC3kz5-9AJ3Vu-6rdBqX-C6eZ1b-vazcSe-vrtoa7-6rcrvc-jfK8K8-efLNE1-6rcrct-jqq5Q9-6rdBMR-ifJPt6-6rhH1U-fhuyRe-brMosb
image_credit: thuyen 0
---
In JavaScript, we are always working with different data types to send to the API or display on the UI. Cloning and altering that clone is a very common thing we do every day. Sometimes we only want to alter the newly cloned data without affecting the original data. For example, we can copy an array and alter the new one and everything works out fine.

```javascript
let originalArray = [1,2,3,4];
let newArray = originalArray.slice();
newArray.push(5);

console.log(originalArray);
[1,2,3,4]

console.log(newArray);
[1,2,3,4,5]
```

As you can see, we can alter the `newArray` and push the integer of 5 in without altering the `originalArray`. This is nothing new and is covered in basic JavaScript, but there can be a gotcha when we need to clone objects. For this example, we are going to imagine we have an array of objects from the API. We want to display that data and filter it from the UI. The idea is to take input from the user, clone the original array we got from the API, and apply the filters without altering the original array. This is where deep cloning and shallow cloning comes in. Below is the way to "clone" this array.

```javascript
let clientList = [
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
    "firstName": "Mickey",
    "lastName": "Mouse",
    "address": "1313 Disneyland Dr",
    "city": "Anaheim",
    "state": "CA",
    "zip": "92802"
  }
]
```

Now if we create a new array called `filteredList` by just assigning it from `clientList` and alter an object, you will see it reflect in both variables.


```javascript
let filteredList = clientList.slice();

filteredList[0].firstName= "Billy";

console.log(filteredList);
"Billy"
console.log(clientList);
"Billy"
```

This is happening because when we created the new array `filteredList`, we only shallow cloned `clientList`. Instead of copying the objects into a new array, we only copied a reference back to the original object. If you alter a reference object, it really changes the original object. This can be an issue if we want to keep the integrity of the original API response object.

## Easy and simple

An easy way to handle this situation is to use `JSON.parse` and `JSON.stringify`. 

`JSON.stringify` works because it turns your entire data structure to a string. Since strings are a primitive value, this removes any references that existed in the object, so when you turn the string back to an array of objects with `JSON.parse` all references are now gone, leaving you with a deep clone.

```javascript
let filteredList = JSON.parse(JSON.stringify(clientList));

filteredList[0].firstName= "Billy";

console.log(filteredList);
"Billy"
console.log(clientList);
"Chuck"
```

This method can help up easily deep clone our objects in arrays and keep the integrity of our original array. I have also included a link to a [codepen](https://codepen.io/anon/pen/JmRjre?editors=1112) with some simple examples.
