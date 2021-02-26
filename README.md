# node-red-contrib-ringcentral-api

## What is it?

A module to bring RingCentral API capabilities into your Node-RED flows! It is based on the work from [Todd Sharp](https://github.com/recursivecodes/node-red-contrib-ring-central)

With the [RingCentral APIs](https://developers.ringcentral.com/) you can send and receive SMS/MMS messages (plus much more) and this module adds this funcionality into your Node-RED flows.

Let's say you are monitoring an API or sensor and you would like to publish an SMS message to your mobile phone every time a certain value is retrieved. Simple - just add an `sms send` node!

The following nodes are available in this module:
* `SMS Send`
* `SMS Receive`
* `Sign URL`
* `Get Meetings`
* `Recordings`
* `Extensions`
* `Presence`

## Getting Started

You'll need a Ring Central account (the free dev account is good enough), so sign up and then [create a new app](https://developers.ringcentral.com/guide) to get the username, password, server, extension, client id, client secret that you'll need in your flows.

## Issues

File an issue on GitHub!

## GitHub

[https://github.com/mailsvb/node-red-contrib-ringcentral-api](https://github.com/mailsvb/node-red-contrib-ringcentral-api)