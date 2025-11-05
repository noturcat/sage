export type LoginType = {
	username?: string
	email?: string
  password: string
}

export type RegisterType = {
  email: string
  password: string
  name?: string
}

export type VerifyOtpType = {
  code: string
	userId: string
}

export type ResendOtpType = {
	userId: string
}

// legacy types removed
