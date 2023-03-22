import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Product } from "./api/product";
import userEvent from "@testing-library/user-event";
import { Basket, SavedBasket } from "./api/basket";

const products: Product[] = [
  {
    id: "P1",
    name: "name for p1",
    description: "description for p1",
    price: 12.99,
  },
  {
    id: "P2",
    name: "name for p2",
    description: "description for p2",
    price: 22.99,
  },
  {
    id: "P3",
    name: "name for p3",
    description: "description for p3",
    price: 30,
    discountPercentage: 10,
  },
];
// declare which API requests to mock
const server = setupServer(
  // capture "GET /greeting" requests
  rest.get("/products", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json([]));
  })
);

// establish API mocking before all tests
beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);

// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// clean up once the tests are done
afterAll(() => server.close());

describe("fetching products", () => {
  test("renders message when fetch returns no products", async () => {
    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-bar"));

    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });
  test("renders products when fetch completes", async () => {
    await renderWithProducts();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
  test("renders an error when fetch returns a 404", async () => {
    server.use(rest.get("/products", (req, res, ctx) => res(ctx.status(404))));
    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-bar"));
    expect(screen.getByText(/products not found/i)).toBeInTheDocument();
  });

  test("renders an error when fetch returns a 500", async () => {
    server.use(rest.get("/products", (req, res, ctx) => res(ctx.status(500))));
    render(<App />);

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-bar"));
    expect(screen.getByText(/error getting products/i)).toBeInTheDocument();
  });
});

describe("displaying products", () => {
  test("should show the price for an item with no discount", async () => {
    await renderWithProducts();

    expect(screen.getByText("£12.99")).toBeInTheDocument();
  });
  test("should show the price for an item with discount", async () => {
    await renderWithProducts();

    expect(screen.getByText("£30.00")).toBeInTheDocument();
    expect(screen.getByText("£27.00")).toBeInTheDocument();
  });
});

describe("single product", () => {
  test("should show the whole product when the name is clicked", async () => {
    await renderWithProducts();

    userEvent.click(screen.getByText(products[0].name));
    expect(
      screen.getByRole("button", { name: /show all products/i })
    ).toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-extra-non-null-assertion
    expect(screen.getByText(products[0].description!!)).toBeInTheDocument();
  });
  test("should show the whole list when the page is closed", async () => {
    await renderWithProducts();

    userEvent.click(screen.getByText(products[0].name));
    userEvent.click(screen.getByRole("button", { name: /show all products/i }));

    expect(screen.queryAllByRole("button", { name: /buy now/i })).toHaveLength(
      products.length
    );
  });
  test("should show a quantity selected on a product page", async () => {
    await renderWithProducts();
    userEvent.click(screen.getAllByRole("button", { name: /buy now/i })[0]);

    userEvent.click(screen.getByText(products[0].name));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(1);
  });
  test("should show a quantity changed on a product page", async () => {
    await renderWithProducts();
    userEvent.click(screen.getAllByRole("button", { name: /buy now/i })[1]);

    userEvent.click(screen.getByText(products[1].name));
    userEvent.type(screen.getByRole("spinbutton"), "1");
    userEvent.click(screen.getByRole("button", { name: /show all products/i }));

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(11);
  });
});

describe("quantities", () => {
  test("should show no quantities on first load", async () => {
    await renderWithProducts();
    expect(
      screen.getByRole("button", { name: /basket \(0\)/i })
    ).toBeDisabled();

    expect(screen.queryAllByRole("spinbutton")).toHaveLength(0);
    expect(screen.queryAllByRole("button", { name: /buy now/i })).toHaveLength(
      products.length
    );
  });

  test("should not show buy now when it has been clicked", async () => {
    await renderWithProducts();
    userEvent.click(screen.getAllByRole("button", { name: /buy now/i })[0]);

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /buy now/i })).toHaveLength(
      products.length - 1
    );
    expect(
      screen.getByRole("button", { name: /basket \(1\)/i })
    ).not.toBeDisabled();
  });

  test("should show buy now when quantity is removed", async () => {
    await renderWithProducts();
    userEvent.click(screen.getAllByRole("button", { name: /buy now/i })[0]);
    userEvent.clear(screen.getByRole("spinbutton"));
    userEvent.tab();

    expect(screen.queryAllByRole("button", { name: /buy now/i })).toHaveLength(
      products.length
    );
  });
});

describe("basket", () => {
  test("should call basket with all products with a quantity selected", async () => {
    const expectedBasketRequestBody = {
      items: [{ id: products[1].id, quantity: 1 }],
    };
    const basketResult: Basket = {
      items: [{ ...products[1], quantity: 1 }],
      total: 123.99,
    };
    let basketBody;
    server.use(
      rest.post("/basket", async (req, res, ctx) => {
        basketBody = await req.json();
        return res(ctx.json(basketResult));
      })
    );
    await getToBasket();

    expect(basketBody).toMatchObject(expectedBasketRequestBody);
    expect(
      screen.getByRole("button", { name: /show products/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Total: £123.99")).toBeInTheDocument();
    expect(screen.getByText(products[1].name)).toBeInTheDocument();
  });

  test("should show product view with quantity still shown when show products is clicked", async () => {
    await showBasketWithData();

    userEvent.click(screen.getByRole("button", { name: /show products/i }));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(1);
    expect(screen.queryAllByRole("button", { name: /buy now/i })).toHaveLength(
      products.length - 1
    );
  });
  test("should show updated basket when quantity is updated", async () => {
    await showBasketWithData();

    const expectedBasketRequestBody = {
      items: [{ id: products[1].id, quantity: 13 }],
    };
    const basketResult2: Basket = {
      items: [{ ...products[1], quantity: 13 }],
      total: 123.99,
    };
    let basketBody;
    server.use(
      rest.post("/basket", async (req, res, ctx) => {
        basketBody = await req.json();
        return res(ctx.json(basketResult2));
      })
    );
    userEvent.type(screen.getByRole("spinbutton"), "3");
    userEvent.tab();

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-bar"));

    expect(basketBody).toMatchObject(expectedBasketRequestBody);
    expect(screen.getByRole("spinbutton")).toHaveValue(13);
  });

  test("should show products when all quantities are removed", async () => {
    await showBasketWithData();
    userEvent.clear(screen.getByRole("spinbutton"));
    userEvent.tab();
    expect(
      screen.queryByRole("button", { name: /show products/i })
    ).not.toBeInTheDocument();
  });

  test("should show product details and errors from the basket call", async () => {
    const basketResult: SavedBasket = {
      items: [
        { ...products[2], quantity: 1 },
        { ...products[1], quantity: 2, error: "a random error" },
      ],
    };

    await showBasketWithData(basketResult);

    expect(screen.getAllByRole("spinbutton")[1]).toHaveValue(1);
    expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(2);
    expect(screen.getByText("a random error")).toBeInTheDocument();
  });

  test("should show an error when the basket call fails", async () => {
    server.use(
      rest.post("/basket", async (req, res, ctx) => res(ctx.status(500)))
    );
    await getToBasket();
    expect(screen.getByText(/error saving basket/i)).toBeInTheDocument();
  });
});

async function renderWithProducts() {
  server.use(rest.get("/products", (req, res, ctx) => res(ctx.json(products))));
  render(<App />);

  await waitForElementToBeRemoved(() => screen.queryByTestId("loading-bar"));
}
async function getToBasket() {
  await renderWithProducts();
  userEvent.click(screen.getAllByRole("button", { name: /buy now/i })[1]);

  userEvent.click(screen.getByRole("button", { name: /basket \(1\)/i }));
  await waitForElementToBeRemoved(() =>
    screen.queryByRole("button", { name: /basket \(1\)/i })
  );
}
async function showBasketWithData(basketData?: SavedBasket) {
  const basketResult: Basket = {
    items: [{ ...products[1], quantity: 1 }],
    total: 123.99,
  };
  server.use(
    rest.post("/basket", async (req, res, ctx) =>
      res(ctx.json(basketData || basketResult))
    )
  );
  await getToBasket();
}
