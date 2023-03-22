const { saveBasket } = require("./basket");
const { findProduct } = require("../product/product");
jest.mock("../product/product");

it("should return an error for a product that is not found", () => {
  findProduct.mockImplementation(() => undefined);
  const basket = {
    items: [
      {
        id: "notFound",
        quantity: 1,
      },
    ],
  };
  const expectedResult = {
    items: [
      {
        id: "notFound",
        quantity: 1,
        error: "Product not found",
      },
    ],
  };

  expect(saveBasket(basket)).toStrictEqual(expectedResult);
});
it("should calculate the total for valid products", () => {
  findProduct.mockImplementation((productId) => {
    switch (productId) {
      case "111":
        return {
          id: "111",
          price: 12.99,
        };
      case "222":
        return {
          id: "222",
          price: 25,
          discountPercentage: 10,
        };
      default:
        break;
    }
    return {};
  });
  const basket = {
    items: [
      {
        id: "111",
        quantity: "1",
      },
      {
        id: "222",
        quantity: "2",
      },
    ],
  };
  const expectedResult = {
    items: [
      {
        id: "111",
        quantity: "1",
        price: 12.99,
        total: "12.99",
      },
      {
        id: "222",
        quantity: "2",
        price: 25,
        discountPercentage: 10,
        total: "45.00",
        discount: "5.00",
      },
    ],
    total: "57.99",
  };

  expect(saveBasket(basket)).toStrictEqual(expectedResult);
});
it("should return an error for a product that has no price", () => {
  findProduct.mockImplementation(() => {
    return {};
  });
  const basket = {
    items: [
      {
        id: "1234",
        quantity: "1",
      },
    ],
  };
  const expectedResult = {
    items: [
      {
        id: "1234",
        quantity: "1",
        error: "Item could not be purchased",
      },
    ],
  };

  expect(saveBasket(basket)).toStrictEqual(expectedResult);
});
it("should return an error for an item that has no quantity", () => {
  findProduct.mockImplementation(() => {
    return { price: 12.99 };
  });
  const basket = {
    items: [
      {
        id: "1234",
      },
    ],
  };
  const expectedResult = {
    items: [
      {
        id: "1234",
        error: "Item could not be purchased",
        quantity: undefined,
      },
    ],
  };

  expect(saveBasket(basket)).toStrictEqual(expectedResult);
});
it("should return an error when the discount is invalid", () => {
  findProduct.mockImplementation((productId) => {
    return {
      id: "222",
      price: 25,
      discountPercentage: "1o",
    };
  });
  const basket = {
    items: [
      {
        id: "222",
        quantity: "2",
      },
    ],
  };
  const expectedResult = {
    items: [
      {
        id: "222",
        quantity: "2",
        error: "Item could not be purchased",
      },
    ],
  };

  expect(saveBasket(basket)).toStrictEqual(expectedResult);
});
