export interface FieldValidation {
  fiel: string
  validate (value: string): Error
}


