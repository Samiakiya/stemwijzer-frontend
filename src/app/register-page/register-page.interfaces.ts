export interface RegisterDetails {
  readonly fullName: string
  readonly email: string
  readonly password: string
}

export interface RegisterResponse {
  readonly id: string
}
