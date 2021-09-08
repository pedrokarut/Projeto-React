import React from 'react'
import faker from 'faker'
import Signup from "./signup"
import { RenderResult, render, cleanup } from '@testing-library/react' 
import { Helper, ValidationStub } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
}
type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError

  const sut = render(
   <Signup
    validation={validationStub}></Signup>
  )
  return {
    sut
  }
}

const testChildCount = (sut: RenderResult, fieldname: string, count: number): void => {
  const errorWrap = sut.getByTestId(fieldname)
    expect(errorWrap.childElementCount).toBe(count)
}
const testButtonIsDisabled = (sut: RenderResult, fieldname: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldname) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}
const testStatusForField = (sut: RenderResult, fieldname: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldname}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
}


describe('Signup Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words() 
    const { sut } = makeSut({ validationError })    
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', 'Campo Obrigatório')
    Helper.testStatusForField(sut, 'email', 'Campo Obrigatório')
    Helper.testStatusForField(sut, 'password', 'Campo Obrigatório')
    Helper.testStatusForField(sut, 'passwordConfirmation', 'Campo Obrigatório')
  })
  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words() 
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name', validationError)
  })
}