export interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUserDTO {
  name: string;
  email: string;
}

export interface IUpdatePasswordUserDTO {
  oldPassword: string;
  newPassword: string;
}
