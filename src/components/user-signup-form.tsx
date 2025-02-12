'use client'

import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signup } from '@/lib/server-actions/auth-actions'
import { FormSchema, SignUpFormSchema } from '@/lib/types'
import { cn } from '@/lib/utils'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	FormLabel,
	FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui'
import { Loader2, MailCheck } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { buttonVariants } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UserSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserSignUpForm({
	className,
	...props
}: UserSignUpFormProps) {
	const [submitError, setSubmitError] = useState('')
	const [confirmation, setConfirmation] = useState(false)
	const searchParams = useSearchParams()

	const codeExchangeError = useMemo(() => {
		if (!searchParams) return ''
		return searchParams.get('error_description')
	}, [searchParams])

	const form = useForm<z.infer<typeof SignUpFormSchema>>({
		mode: 'onChange',
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
	const isLoading = form.formState.isSubmitting

	const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
		const response = await signup({ email, password })

		if ('error' in response && response.error.message) {
			setSubmitError(response.error.message)
			// setSubmitError('An email confirmation has been sent.')
			form.reset()
			return
		}
		setConfirmation(true)
	}

	async function onSignUpGithub() {
		setIsGitHubLoading(true)
		// TODO: Add signin using preferred provider
		await new Promise((resolve) => setTimeout(resolve, 1000))
		setIsGitHubLoading(false)
	}

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form {...form}>
				<form
					onChange={() => {
						if (submitError) setSubmitError('')
					}}
					onSubmit={form.handleSubmit(onSubmit)}
				>
					{!confirmation && !codeExchangeError && (
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										{/* <FormLabel>Email</FormLabel> */}
										<FormControl>
											<Input
												id="email"
												placeholder="name@example.com"
												type="email"
												autoCapitalize="none"
												autoComplete="email"
												autoCorrect="off"
												disabled={isLoading || isGitHubLoading}
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your email address.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										{/* <FormLabel>Password</FormLabel> */}
										<FormControl>
											<Input
												id="password"
												placeholder="Enter a password"
												type="password"
												autoCapitalize="none"
												autoComplete="password"
												autoCorrect="off"
												disabled={isLoading || isGitHubLoading}
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										{/* <FormLabel>Confirm password</FormLabel> */}
										<FormControl>
											<Input
												id="confirmPassword"
												placeholder="Confirm your password"
												type="password"
												autoCapitalize="none"
												autoComplete="password"
												autoCorrect="off"
												disabled={isLoading || isGitHubLoading}
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>Confirm your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>

							{submitError && <FormMessage>{submitError}</FormMessage>}

							<button
								type="submit"
								className={cn(buttonVariants())}
								disabled={isLoading || isGitHubLoading}
							>
								{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
								Sign Up
							</button>
						</div>
					)}

					{(confirmation || codeExchangeError) && (
						<>
							<Alert>
								{!codeExchangeError && <MailCheck className="h-4 w-4" />}
								<AlertTitle>
									{codeExchangeError ? 'Invalid Link' : 'Check your email.'}
								</AlertTitle>
								<AlertDescription>
									{codeExchangeError || 'An email confirmation has been sent.'}
								</AlertDescription>
							</Alert>
						</>
					)}
				</form>
			</Form>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background text-muted-foreground px-2">
						Or continue with
					</span>
				</div>
			</div>

			<button
				type="button"
				className={cn(buttonVariants({ variant: 'outline' }))}
				onClick={() => {
					onSignUpGithub()
				}}
				disabled={isLoading || isGitHubLoading}
			>
				{isGitHubLoading ? (
					<Loader2 className="mr-2 size-4 animate-spin" />
				) : (
					<GitHubLogoIcon className="mr-2 size-4" />
				)}
				Github
			</button>
		</div>
	)
}
