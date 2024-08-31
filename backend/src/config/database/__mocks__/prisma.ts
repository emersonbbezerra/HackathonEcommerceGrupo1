export const prismaMock = {
  user: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
};
