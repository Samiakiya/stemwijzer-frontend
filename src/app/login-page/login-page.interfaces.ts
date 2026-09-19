export interface LoginCredentials {
  readonly email: string
  readonly password: string
  readonly rememberMe: boolean
}

export interface LoginResponse {
  readonly token: string
}
