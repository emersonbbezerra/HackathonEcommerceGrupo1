import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { ZodError } from "zod";
import {
  CreateProductDTO,
  CreateProductType,
  UpdateProductDTO,
  UpdateProductType,
} from "./dtos/product.dto";
import { ProductSchema } from "./entities/product";
import { IProductController, ProductController } from "./products.controller";
import { ProductsService } from "./products.service";

jest.mock("./products.service");

let productController: IProductController;
let productsServiceMock: jest.Mocked<ProductsService>;

describe("ProductController", () => {
  beforeEach(() => {
    productsServiceMock = new ProductsService(
      prismaMock,
    ) as jest.Mocked<ProductsService>;
    productController = new ProductController(productsServiceMock);
  });

  describe("findAll products", () => {
    it("Should successfully find all products", async () => {
      const productsData: ProductSchema[] = [
        {
          id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
          name: "Product A",
          description: "Description for Product A",
          image: "http://example.com/product-a.jpg",
          price: 19.99,
          category: "Category1",
          created_at: new Date("2024-08-30T19:30:57.510Z"),
          updated_at: new Date("2024-08-30T19:30:57.510Z"),
        },
        {
          id: "d426bcf6-8536-41f3-91ba-c39c345678w1",
          name: "Product B",
          description: "Description for Product B",
          image: "http://example.com/product-b.jpg",
          price: 29.99,
          category: "Category2",
          created_at: new Date("2024-08-28T19:30:57.510Z"),
          updated_at: new Date("2024-08-28T19:30:57.510Z"),
        },
      ];
      productsServiceMock.findAll.mockResolvedValueOnce(productsData);

      const resp = await productController.findAll();

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully find all products", productsData),
      );
    });

    it("Should return ServerResponse with error when findAll fails", async () => {
      const errorMessage = "Failed to find products";
      productsServiceMock.findAll.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const resp = await productController.findAll();

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Create product", () => {
    const httpRequest: CreateProductType = {
      name: "Product A",
      description: "Description for Product A",
      image: "http://example.com/product-a.jpg",
      price: 19.99,
      category: "Category1",
    };

    it("Should return ZodValidateError", async () => {
      const zodError = new ZodError([]);
      jest.spyOn(CreateProductDTO, "parse").mockImplementationOnce(() => {
        throw zodError;
      });

      const resp = await productController.create(httpRequest);

      expect(resp).toBeInstanceOf(ZodValidateError);
      expect((resp as ZodValidateError).errors).toEqual(zodError.errors);
    });

    it("Should successfully create a product", async () => {
      const productData: ProductSchema = {
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        ...httpRequest,
        created_at: new Date(),
        updated_at: new Date(),
      };
      productsServiceMock.create.mockResolvedValueOnce(productData);

      const resp = await productController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(201, "Successfully create product", productData),
      );
    });

    it("Should return ServerResponse when product creation fails", async () => {
      productsServiceMock.create.mockRejectedValueOnce(
        new Error("Creation failed"),
      );

      const resp = await productController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, "Creation failed"));
    });
  });

  describe("findOne product", () => {
    it("Should successfully find one product", async () => {
      const productData: ProductSchema = {
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        name: "Product A",
        description: "Description for Product A",
        image: "http://example.com/product-a.jpg",
        price: 19.99,
        category: "Category1",
        created_at: new Date("2024-08-30T19:30:57.510Z"),
        updated_at: new Date("2024-08-30T19:30:57.510Z"),
      };
      productsServiceMock.getByUnique.mockResolvedValueOnce(productData);

      const resp = await productController.findOne({ id: productData.id });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully find product by id", productData),
      );
    });

    it("Should return ServerResponse with error when findOne fails", async () => {
      const errorMessage = "Failed to find product";
      productsServiceMock.getByUnique.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const resp = await productController.findOne({ id: "non-existing-id" });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Update product", () => {
    const id = "product-id";
    const httpRequest: UpdateProductType = {
      name: "Updated Product",
      description: "Updated description",
      price: 25.99,
      category: "UpdatedCategory",
    };

    it("Should successfully update a product", async () => {
      const updatedProductData: ProductSchema = {
        id,
        name: httpRequest.name!,
        description: httpRequest.description!,
        image: null,
        price: httpRequest.price!,
        category: httpRequest.category!,
        created_at: new Date(),
        updated_at: new Date(),
      };

      productsServiceMock.update.mockResolvedValueOnce(updatedProductData);

      const resp = await productController.update(id, httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(
          202,
          "Successfully update product",
          updatedProductData,
        ),
      );
    });
  });

  describe("Delete product", () => {
    const id = "product-id";

    it("Should successfully delete a product", async () => {
      productsServiceMock.delete.mockResolvedValueOnce(true);

      const resp = await productController.delete(id);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(202, "Successfully delete product", true),
      );
    });

    it("Should return ServerResponse with error when delete fails", async () => {
      const errorMessage = "Deletion failed";
      productsServiceMock.delete.mockRejectedValueOnce(new Error(errorMessage));

      const resp = await productController.delete(id);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });
});
