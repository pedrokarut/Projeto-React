import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import faker from 'faker'
import 'jest-localstorage-mock'
import { InvalidCredentialsError } from '@/domain/errors'





type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy}></Login>)
  return {
    sut,
    authenticationSpy    
  }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
    populateEmailField(sut, email)
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    fireEvent.click(submitButton)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (sut: RenderResult, fieldname: string, validationError?: string): void => {
  const emailStatus = sut.getByTestId(`${fieldname}-status`)
  expect(emailStatus.title).toBe(validationError || 'Tudo certo!')
}

describe('Login Component', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})
    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    simulateStatusForField(sut, 'email', validationError)
    simulateStatusForField(sut, 'password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const { sut } = makeSut()
    const validationError = faker.random.words()    const emailInput = sut.getByTestId('email')
    populateEmailField(sut)
    simulateStatusForField(sut, 'email', validationError)
  })
  test('Should show password error if Validation fails', () => {
    const { sut } = makeSut()
    const validationError = faker.random.words()    const emailInput = sut.getByTestId('email')
    populatePasswordField(sut)
    const passwordStatus = sut.getByTestId('email-status')
    expect(passwordStatus.title).toBe(validationError)
  })
  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    simulateStatusForField(sut, 'password')
  })
  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    simulateStatusForField(sut, 'email')
  })
  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })
  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  test('Should call Autentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    const password = faker.internet.password() 
    simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email, 
      password
    })
  })
  test('Should call Autentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })
  test('Should not call Autentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })
  test('Should present error if Authentication fails', async () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    simulateValidSubmit(sut)
    const errorWrap = sut.getByTestId('error-wrap')
    await waitFor(() => errorWrap)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })
  test('Should add accessToken to localstorage on success', async () => {
    const { sut, authenticationSpy  } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('form'))
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken())
  })
})
