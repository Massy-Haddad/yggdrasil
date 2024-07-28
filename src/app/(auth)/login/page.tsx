'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import * as z from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSchema } from '@/lib/types'
import { Form } from '@/components/ui/form'
import { ChevronLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UserAuthForm } from '@/components'

const LoginPage = () => {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Link
				href="/"
				className={cn(
					buttonVariants({ variant: 'ghost' }),
					'absolute left-4 top-4 md:left-8 md:top-8'
				)}
			>
				<>
					<ChevronLeft className="mr-2 size-4" />
					Back
				</>
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
				<div className="flex flex-col gap-2 text-center">
					{/* <Icons.logo className="mx-auto h-6 w-6" /> */}
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome back
					</h1>
					<p className="text-muted-foreground text-sm">Login to your account</p>
				</div>
				<UserAuthForm />
				<p className="text-muted-foreground px-8 text-center text-sm">
					<Link
						href="/register"
						className="hover:text-brand underline underline-offset-4"
					>
						Don&apos;t have an account? Sign Up
					</Link>
				</p>
			</div>
		</div>
	)
}

export default LoginPage
