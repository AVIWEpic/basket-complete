import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Product } from './api/product';
import userEvent from '@testing-library/user-event';
import { Basket } from './api/basket';

const products: Product[] = [
  {
    id: 'P1',
    name: 'name for p1',
    description: 'description for p1',
    price: 12.99,
  },
  {
    id: 'P2',
    name: 'name for p2',
    description: 'description for p2',
    price: 22.99,
  },
  {
    id: 'P3',
    name: 'name for p3',
    description: 'description for p3',
    price: 30,
    discountPercentage: 10
  },

]
// declare which API requests to mock
const server = setupServer(
  // capture "GET /greeting" requests
  rest.get('/products', (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json([]))
  }),
)

// establish API mocking before all tests
beforeAll(() => server.listen({
  onUnhandledRequest: 'error'
}))

// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())

// clean up once the tests are done
afterAll(() => server.close())

describe('fetching products', () => {

  test('renders message when fetch returns no products', async () => {

    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-bar'));

    expect(screen.getByText(/No products found/i)).toBeInTheDocument();

  });
  test('renders products when fetch completes', async () => {
    await renderWithProducts()
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    })

  });
  test('renders an error when fetch returns a 404', async () => {
    server.use(
      rest.get('/products', (req, res, ctx) => res(ctx.status(404)))
    )
    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-bar'));
    const linkElement = screen.getByText(/products/i);
    expect(screen.getByText(/products not found/i)).toBeInTheDocument();

  });

  test('renders an error when fetch returns a 500', async () => {
    server.use(
      rest.get('/products', (req, res, ctx) => res(ctx.status(500)))
    )
    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-bar'));
    const linkElement = screen.getByText(/products/i);
    expect(screen.getByText(/error getting products/i)).toBeInTheDocument();
  });
});

describe('displaying products', () => {
  test('should show the price for an item with no discount', async () => {
    await renderWithProducts()

    expect(screen.getByText('£12.99')).toBeInTheDocument()

  })
  test('should show the price for an item with no discount', async () => {
    await renderWithProducts()

    expect(screen.getByText('£30.00')).toBeInTheDocument()
    expect(screen.getByText('£27.00')).toBeInTheDocument()

  })
})

describe('quantities', () => {
  test('should show no quantities on first load', async () => {
    await renderWithProducts()
    expect(screen.queryAllByRole('spinbutton')).toHaveLength(0)
    expect(screen.queryAllByRole('button', { name: /buy now/i })).toHaveLength(products.length)
  })

  test('should not show buy now when it has been clicked', async () => {
    await renderWithProducts()
    userEvent.click(screen.getAllByRole('button', { name: /buy now/i })[0])

    expect(screen.getByRole("spinbutton")).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /buy now/i })).toHaveLength(products.length - 1)
  })

  test('should show buy now when quantity is removed', async () => {
    await renderWithProducts()
    userEvent.click(screen.getAllByRole('button', { name: /buy now/i })[0])
    userEvent.clear(screen.getByRole("spinbutton"))

    expect(screen.queryAllByRole('button', { name: /buy now/i })).toHaveLength(products.length)
  })
})

describe('basket', () => {
  test('should call basket with all products with a quantity selected', async () => {
    const expectedBasketRequestBody = {
      items: [
        { id: products[1].id, quantity: 1 },
      ],
    }
    const basketResult: Basket = {
      items: [
        { ...products[1], quantity: 1 },
      ],
      total: 23.99
    }
    let basketBody;
    server.use(
      rest.post('/basket', async (req, res, ctx) => {
        basketBody = await req.json();
        return res(ctx.json(basketResult))
      })
    )
    await renderWithProducts()
    userEvent.click(screen.getAllByRole('button', { name: /buy now/i })[1])

    userEvent.click(screen.getByRole('button', { name: /view basket/i }))

    await waitForElementToBeRemoved(screen.getByRole('button', { name: /view basket/i }))

    expect(basketBody).toMatchObject(expectedBasketRequestBody)

  })

  test('should show total when the basket call returns one', async () => { })
  test('should show product view when all quantities are removed', async () => { })

  test('should call basket again when a quantity changes', async () => { })


  test('should show product details and errorsfrom the basket call', async () => { })

  test('should show no total when the basket call returns none', async () => { })
  test('should show an error when the basket call fails', async () => { })

})

async function renderWithProducts() {
  server.use(
    rest.get('/products', (req, res, ctx) => res(ctx.json(products)))
  )
  render(<App />);

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-bar'));
}