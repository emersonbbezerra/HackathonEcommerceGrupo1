jest.mock("@/config/database/prisma", () => ({
  Prisma: jest.fn(
    () => require("@/config/database/__mocks__/prisma").prismaMock,
  ),
}));
