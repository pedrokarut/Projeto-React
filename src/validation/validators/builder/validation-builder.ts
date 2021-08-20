import { RequiredFieldValidation } from '../required-field/required-field-validation'
import { FieldValidation, EmailValidation } from '@/validation/validators'
import { MinLengthValidation } from '@/validation/min-length/min-length-validation'

export class ValidationBuilder {
  private constructor (private readonly fieldname: string,
    private readonly validations: FieldValidation[]
  ) {}

  static field (fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName, [])
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldValidation(this.fieldname))
    return this
  }

  email (): ValidationBuilder {
    this.validations.push(new EmailValidation(this.fieldname))
    return this
  }

  min (length: number): ValidationBuilder {
    this.validations.push(new MinLengthValidation(this.fieldname, length))
    return this
  }

  build (): FieldValidation[] {
    return this.validations
  }
}
