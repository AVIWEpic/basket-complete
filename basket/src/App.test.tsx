import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Product } from './api/product';

const products: Product[] = [
  {
    id: 'P1',
    name: 'name for p1',
    description: 'description for p1',
    price: 12.99
  }
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
    server.use(
      rest.get('/products', (req, res, ctx) => res(ctx.json(products)))
    )
    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-bar'));

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