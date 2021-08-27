import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages/login'
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock } from '@/presentation/test'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'





type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}
const history = createMemoryHistory({ initialEntries: ['/login']})
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock() 
  validationStub.errorMessage = params?.validationError
  const sut = render(
  <Router history={history}>
    <Login validation={validationStub} 
    authentication={authenticationSpy}
    saveAccessToken={saveAccessTokenMock}></Login>
  </Router>
  )
  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock   
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
    populateEmailField(sut, email)
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })
    const form = sut.getByTestId('form')
    fireEvent.submit(form)
    await waitFor(() => form)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testStatusForField = (sut: RenderResult, fieldname: string, validationError?: string): void => {
  const emailStatus = sut.getByTestId(`${fieldname}-status`)
  expect(emailStatus.title).toBe(validationError || 'Tudo certo!')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(count)
}
const testElementExists = (sut: RenderResult, fieldname: string): void => {
  const el = sut.getByTestId(fieldname)
  expect(el).toBeTruthy()
}
const testElementText = (sut: RenderResult, fieldname: string, text: string): void => {
  const el = sut.getByTestId(fieldname)
  expect(el.textContent).toBe(text)
}
const testButtonIsDisabled = (sut: RenderResult, fieldname: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldname) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}


describe('Login Component', () => {
  afterEach(cleanup)
  
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({validationError})    
    testErrorWrapChildCount(sut, 0)
    testButtonIsDisabled(sut, 'submit', true)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const { sut } = makeSut()
    const validationError = faker.random.words()    const emailInput = sut.getByTestId('email')
    populateEmailField(sut)
    testStatusForField(sut, 'email', validationError)
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
    testStatusForField(sut, 'password')
  })
  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    testStatusForField(sut, 'email')
  })
  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    testButtonIsDisabled(sut, 'submit', false)
  })
  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
  })
  test('Should call Autentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    const password = faker.internet.password() 
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })
  test('Should call Autentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })
  test('Should not call Autentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })
  test('Should present error if Authentication fails', async () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)  
})
  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock  } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe(authenticationSpy.account.accessToken)
  })
  test('Should go to signup page', async () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup') 
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
  test('Should present error if SaveAcessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)  
})
})
