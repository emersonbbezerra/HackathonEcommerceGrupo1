import { User } from "./entities/user";

interface IUsersRepository {
  create(): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(): Promise<User>;
  update(): Promise<User>;
  delete(): Promise<User>;
}

class UsersRepository implements IUsersRepository {
  constructor() {}
  create(): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  findOne(): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(): Promise<User> {
    throw new Error("Method not implemented.");
  }
}

export { UsersRepository };
