import { Validation } from "@/presentation/protocols/validation";

export class ValidationSpy implements Validation {
  input?: any;
  error: Error | null = null;
  validate(input: any): Error | null {
    this.input = input;
    return this.error;
  }
}
