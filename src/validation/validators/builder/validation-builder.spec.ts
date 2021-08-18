import { FieldValidation } from "@/validation/protocols/field-validation"
import { RequiredFieldValidation } from "../required-field/required-field-validation"

class ValidationBuilder {
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

  build (): FieldValidation[] {
    return this.validations
  }
}

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const validations = ValidationBuilder.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })
)}
