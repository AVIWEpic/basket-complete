# Starting the server

`node app.js`

# generating test data

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
    imageUrl: 'https://picsum.photos/200',
    discountPercentage: '{{floating(10, 90, 2)}}'
  }
]
