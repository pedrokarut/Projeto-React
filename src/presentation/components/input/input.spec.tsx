import React from 'react'
import faker from 'faker'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import Input from './input'
import Context from '@/presentation/context/form/form-context'

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName}>
      </Input>
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const field =  faker.database.column()
    const sut = makeSut(field)
    const input = sut.getByTestId(field) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })
  describe('Input Component', () => {
    test('Should remove readOnly on Focus', () => {
      const field =  faker.database.column()
      const sut = makeSut(field)
      const input = sut.getByTestId(field) as HTMLInputElement
      fireEvent.focus(input)
      expect(input.readOnly).toBe(true)
    })
})