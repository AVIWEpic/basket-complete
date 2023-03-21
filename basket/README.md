# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## generating test data

use `https://json-generator.com/` with 

```
[
  '{{repeat(5, 70)}}',
  {
    id: '{{objectId()}}',
    name: '{{lorem(2, "words")}}',
    description: '{{lorem(3, "paragraphs")}}',
    isActive: '{{bool()}}',
    price: '{{floating(10, 4000, 2)}}',
    imageUrl: 'http://placehold.it/32x32',
    discount: '{{floating(10, 90, 2)}}'
  }
]
```