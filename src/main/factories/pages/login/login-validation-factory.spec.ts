import { ValidationComposite } from "@/validation/validators"
import { ValidationBuilder } from "@/validation/validators/builder/validation-builder"
import { makeLoginValidation } from "../login-validation-factory"

describe('LoginValidationFactory', () => {
   test('Should compose ValidationComposite with correct validations', () => {
    const compoosite = makeLoginValidation()
    expect(compoosite).toEqual(ValidationComposite.build([
      ...ValidationBuilder.field('email').required().email().build(),
      ...ValidationBuilder.field('password').required().min(5).build()
    ]))
  })
}