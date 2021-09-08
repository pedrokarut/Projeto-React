import { fireEvent, RenderResult } from "@testing-library/react"
import faker from 'faker'

export const testChildCount = (sut: RenderResult, fieldname: string, count: number): void => {
  const errorWrap = sut.getByTestId(fieldname)
  expect(errorWrap.childElementCount).toBe(count)
}

export const testStatusForField = (sut: RenderResult, fieldname: string, validationError?: string): void => {
  const emailStatus = sut.getByTestId(`${fieldname}-status`)
  expect(emailStatus.title).toBe(validationError || 'Tudo certo!')
}


export const testButtonIsDisabled = (sut: RenderResult, fieldname: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldname) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const populateField = (sut: RenderResult, fieldname: string, value = faker.random.word(), password = faker.internet.password()): void => {
  const input = sut.getByTestId(fieldname)
  fireEvent.input(input, { target: { value } })
}