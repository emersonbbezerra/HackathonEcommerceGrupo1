import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { CreateProductType, UpdateProductType } from "./dtos/product.dto";
import { ProductsService } from "./products.service";
import { ProductSchema } from "./entities/product";

let productsService: ProductsService;

describe("ProductsService", () => {
  const httpRequest: CreateProductType = {
    name: "Product A",
    description: "Description for Product A",
    image: "http://example.com/product-a.jpg",
    price: 19.99,
    category: "Category1",
  };

  beforeEach(() => {
    productsService = new ProductsService(prismaMock);
  });

  describe("Create product", () => {
    it("Should throw an error if product already exists", async () => {
      prismaMock.product.findFirst.mockResolvedValue({
        id: "e537cdg7-9647-52g4-02cb-d40d692664f3",
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "Category1",
        created_at: new Date("2024-09-01T17:37:57.510Z"),
        updated_at: new Date("2024-09-01T17:37:57.510Z"),
      });

      await expect(productsService.create(httpRequest)).rejects.toThrow(
        "Product already exists.",
      );
    });

    it("Should create a new product successfully", async () => {
      prismaMock.product.findFirst.mockResolvedValue(null);
      prismaMock.product.create.mockResolvedValue({
        id: "e537cdg7-9647-52g4-02cb-d40d692664f3",
        name: "any_name",
        description: "any_description",
        image: null,
        price: 9.99,
        category: "any_category",
        created_at: new Date("2024-09-01T17:37:57.510Z"),
        updated_at: new Date("2024-09-01T17:37:57.510Z"),
      });

      const result = await productsService.create(httpRequest);
      expect(result).toEqual({
        id: "e537cdg7-9647-52g4-02cb-d40d692664f3",
        name: "any_name",
        description: "any_description",
        image: null,
        price: 9.99,
        category: "any_category",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe("Check If Product Exists", () => {
    it("Should return null if product does not exist", async () => {
      prismaMock.product.findFirst.mockResolvedValue(null);

      const result = await prismaMock.product.findFirst(
        {
          field: "name",
          value: httpRequest.name,
        },
        {
          field: "category",
          value: httpRequest.category,
        },
      );

      expect(result).toBeNull();
    });

    it("Should return product if it exists", async () => {
      const productData: ProductSchema = {
        id: "e537cdg7-9647-52g4-02cb-d40d692664f3",
        ...httpRequest,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prismaMock.product.findFirst.mockResolvedValue(productData);

      const result = await productsService.getByUnique({
        field: "name",
        value: httpRequest.name,
      });
      expect(result).toEqual(productData);
    });
  });

  describe("Update product", () => {
    const id = "product-id";
    const updateData: UpdateProductType = {
      name: "Updated Product",
      description: "Updated description",
      price: 25.99,
      category: "UpdatedCategory",
    };

    it("Should throw an error if product does not exist", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue(null);

      await expect(productsService.update(id, updateData)).rejects.toThrow(
        "Product not exist.",
      );
    });

    it("Should return ServerError if update fails", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue({
        id,
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "any_category",
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest
        .spyOn(productsService.prisma.product, "update")
        .mockResolvedValue(null);

      await expect(productsService.update(id, updateData)).rejects.toThrow(
        "Update failed",
      );
    });

    it("Should update a product successfully", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue({
        id,
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "any_category",
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest.spyOn(productsService.prisma.product, "update").mockResolvedValue({
        id,
        name: updateData.name,
        description: updateData.description,
        image: updateData.image,
        price: updateData.price,
        category: updateData.category,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await productsService.update(id, updateData);

      expect(result).toBe(true);
    });
  });

  describe("Delete product", () => {
    it("Should delete the product successfully", async () => {
      prismaMock.product.delete.mockResolvedValue({
        id: "e537cdg7-9647-52g4-02cb-d40d692664f3",
        name: "any_name",
        description: "any_description",
        image: null,
        price: 9.99,
        category: "any_category",
        created_at: new Date("2024-09-01T17:37:57.510Z"),
        updated_at: new Date("2024-09-01T17:37:57.510Z"),
      });

      const result = await productsService.delete(
        "e537cdg7-9647-52g4-02cb-d40d692664f3",
      );

      expect(result).toBe(true);
    });

    it("Should throw an error if product does not exist", async () => {
      prismaMock.product.delete.mockResolvedValue(null);

      await expect(productsService.delete("non-existing-id")).rejects.toThrow(
        "Product not exist.",
      );
    });
  });
});
