import { InvalidFieldError } from "../errors"
import { FieldValidation } from "../protocols/field-validation"
import { MinLengthValidation } from "./min-length-validation"
import faker from 'faker'

const makeSut = (): MinLengthValidation => new MinLengthValidation(faker.database.column(), 5)


describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(4))
    expect(error).toEqual(new InvalidFieldError())
  })
  test('Should return error if value is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
})