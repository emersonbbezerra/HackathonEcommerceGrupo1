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
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "Category1",
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(productsService.create(httpRequest)).rejects.toThrow(
        "Product already exists.",
      );
    });

    it("Should create a new product successfully", async () => {
      prismaMock.product.findFirst.mockResolvedValue(null);
      prismaMock.product.create.mockResolvedValue({
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        ...httpRequest,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await productsService.create(httpRequest);
      expect(result).toEqual({
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        ...httpRequest,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe("Check If Product Exists", () => {
    it("Should return null if product does not exist", async () => {
      prismaMock.product.findFirst.mockResolvedValue(null);

      const result = await productsService.getByUnique({
        field: "name",
        value: httpRequest.name,
      });

      expect(result).toBeNull();
    });

    it("Should return product if it exists", async () => {
      const productData: ProductSchema = {
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
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

      const result = await productsService.update(id, updateData);
      expect(result).toEqual(new ServerError("Product not found."));
    });

    it("Should return ServerError if update fails", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue({
        id,
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "Category1",
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest
        .spyOn(productsService.prisma.product, "update")
        .mockResolvedValue(null);

      const result = await productsService.update(id, updateData);

      expect(result).toBeInstanceOf(ServerError);
      expect(result).toEqual(new ServerError("Update failed"));
    });

    it("Should update a product successfully", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue({
        id,
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "Category1",
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest.spyOn(productsService.prisma.product, "update").mockResolvedValue({
        id,
        ...updateData,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await productsService.update(id, updateData);

      expect(result).toBe(true);
    });
  });

  describe("Delete product", () => {
    const id = "product-id";

    it("Should return ServerError if product does not exist", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue(null);

      const result = await productsService.delete(id);
      expect(result).toBeInstanceOf(ServerError);
      expect(result).toEqual(new ServerError("Product not found."));
    });

    it("Should return true if product is deleted successfully", async () => {
      jest.spyOn(productsService, "getByUnique").mockResolvedValue({
        id,
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "Category1",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await productsService.delete(id);
      expect(result).toBe(true);
    });
  });
});
