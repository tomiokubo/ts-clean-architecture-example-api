import {
  CreateAccount,
  CreateAccountParams,
} from "@/domain/usecases/create-account";

export class CreateAccountSpy implements CreateAccount {
  params?: CreateAccountParams;
  result: boolean = true;
  async create(params: CreateAccountParams): Promise<boolean> {
    this.params = params;
    return this.result;
  }
}
