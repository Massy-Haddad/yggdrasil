import { z } from 'zod'

export const FormSchema = z.object({
	email: z.string().describe('Email').email({ message: 'Invalid email' }),
	password: z
		.string()
		.describe('Password')
		.min(8, { message: 'Password must be at least 8 characters' }),
})

export const SignUpFormSchema = z
	.object({
		email: z.string().describe('Email').email({ message: 'Invalid email' }),
		password: z
			.string()
			.describe('Password')
			.min(8, { message: 'Password must be at least 8 characters' }),
		confirmPassword: z
			.string()
			.describe('Confirm Password')
			.min(8, { message: 'Password must be at least 8 characters' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})