---
layout: post
title: "Javascript Object Cloning"
date: 2018-10-08 08:00:39
tags:
- Javascript
categories:
- Javascript
twitter_text: "Easily clone objects in Javascript"
authors: Andrew Rady 
image: https://farm1.staticflickr.com/662/33187648151_1d955c27f8_b.jpg
image_url: https://www.flickr.com/photos/144219502@N04/33187648151/in/photolist-SyFnyc-kwoER4-5JfofT-74J7Tr-93v3Uu-qnMB76-2k6wVZ-hkgDQn-s6ny87-bo5sQU-po3Gcn-avBpY7-agqKqj-onWNK4-asuj8-dV54t7-cDCYSN-qbpekY-qvG8sd-vdB6e-e391ip-4rZG52-vsmwxr-dK52hk-aispHU-7k8waH-fEwnAz-e6msZV-pUg4DB-7fc36Q-mQZiPR-311nS6-qQ13Vj-mkGPf2-AC3kz5-9AJ3Vu-6rdBqX-C6eZ1b-vazcSe-vrtoa7-6rcrvc-jfK8K8-efLNE1-6rcrct-jqq5Q9-6rdBMR-ifJPt6-6rhH1U-fhuyRe-brMosb
image_credit: thuyen 0
---
In Javascript we are always working with different data types to send to the api or display on the UI. Cloning and altering that clone is a very common thing we do every day. Sometimes we only want to alter the new cloned data without effect the original data. For example, we can copy an array alter the new one and everything works out fine.

```javascript
let originalArray = [1,2,3,4];
let newArray = originalArray;
newArray.push(5)l

console.log(originalArray);
[1,2,3,4]

console.log(newArray);
[1,2,3,4,5]
```

As you can see we can alter the newArray and push the integer of 5 in without altering the originalArray. This is nothing new and is covered for a basic of Javascript. There can be a basic gotcha when we need to clone objects. For this example, we are going to imagine we have an array of objects from the api. We want to display that data and all filtering is going to be only UI filtering. The idea is to take input from the user, clone the original array we got from the api and apply the filters without altering the original array. This is where deep cloning and shallowing cloning comes in.  Below is way to “clone” this array.

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
    "firstName": "Micky",
    "lastName": "Mouse",
    "address": "1313 Disneyland Dr",
    "city": "Anaheim",
    "state": "CA",
    "zip": "92802"
  }
]
```

Now if we create a new array called `filteredList` by just assigned it from `clientList` and alter an object you will see it reflect in both variables.

```javascript
let filteredList = clientList;

filteredList.[0].firstName= “Billy”;

console.log(filteredList);
firstName: “Billy”
console.log(clientList);
firstName: “Billy”
```

This is happening because when we created the new array `filteredList` we are only shallow cloning `clientList`. Instead of copying the objects into the new array we are only copying a reference back to the original object. If you alter a reference object it really changes the original object. This can be an issue if we want to keep the integrity of the original api response object. 

## Easy and simple

An easy way to handle this situation is to use `JSON.parse` and `JSON.stringify`. This will do a deep clone of `clientList` and you can alter `filteredList` without effecting `clientList`. 

```javascript
let filteredList = JSON.parse(JSON.stringify(clientList));

filteredList.[0].firstName= “Billy”;

console.log(filteredList);
firstName: “Billy”
console.log(clientList);
firstName: “Chuck”
```

This method can help up easily deep clone our objects in arrays and keep the integrity of our original array. I have also included a link to a [codepen](https://codepen.io/anon/pen/JmRjre?editors=1112) with some simple examples.