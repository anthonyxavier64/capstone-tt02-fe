export class User {
  id: number | undefined;
  email: string | undefined;
  fullName: string | undefined;
  gender: string | undefined;
  resetPasswordToken: string | undefined;

  constructor(
    id?: number,
    email?: string,
    fullName?: string,
    gender?: string,
    resetPasswordToken?: string
  ) {
      this.id = id;
      this.email = email;
      this.fullName = fullName;
      this.gender = gender;
      this.resetPasswordToken = resetPasswordToken;
  }
}
