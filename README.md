# Mohawk

A bad-ass object document mapper for Amazon
[DynamoDB](https://aws.amazon.com/dynamodb/).

## WIP Warning

This is a work in progress. Currently dynamo only offers limited functionality
(and test converage). There will be more to come soon. API changes will likely
happen.

## Install

```bash
$ npm install mohawk --save
```

## Usage

*Mohawk is designed to work well future language features (like async/await)
offered by [babel](http://babeljs.io/). As such all examples assume you are
using babel.*

```js
import {BaseModel} from 'mohawk'
import {DynamoDB} from 'aws-sdk'

class AppModel extends BaseModel {
  static prefix = 'myapp-'
  static service = new DynamoDB({
    // dynamo config options here...
  })
}

class Thing extends AppModel {
  static table = 'things'
  static hashKey = 'id'
  static rangeKey = 'version'
}

async function example() {
  let thing = new Thing({id: 'foo', version: 'bar', name: 'baz'})
  await thing.save() // => true 
  await thing.save() // => false, already saved
  thing.name = 'buz'
  await thing.save() // => true, changed since last saved

  let otherThing = await Thing.find('someid', 'someversion')
  await otherThing.save() // => false, not change yet
  otherThing.name = 'Mr. T'
  otherThing.save() // => true

  // ... you get the idea
}
```
