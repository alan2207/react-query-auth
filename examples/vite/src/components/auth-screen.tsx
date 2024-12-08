import * as React from "react"

import { type LoginCredentials, type RegisterCredentials, useLogin, useRegister } from "@/lib/auth"

import { Button, Form, Input } from "./ui"

export const AuthScreen = () => {
	const [mode, setMode] = React.useState<"register" | "login">("register")

	return (
		<div>
			{mode === "login" && (
				<>
					<LoginForm />
					<Button onClick={() => setMode("register")}>Register</Button>
				</>
			)}
			{mode === "register" && (
				<>
					<RegisterForm />
					<Button onClick={() => setMode("login")}>Login</Button>
				</>
			)}
		</div>
	)
}

const useForm = <V extends Record<string, any>>(initialValues?: V) => {
	const [values, setValues] = React.useState<V | {}>(initialValues || {})

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
	}

	return {
		values: values as V,
		onChange,
	}
}

const RegisterForm = () => {
	const register = useRegister()
	const { values, onChange } = useForm<RegisterCredentials>()

	return (
		<Form
			title="Register"
			onSubmit={(e) => {
				e.preventDefault()
				register.mutate(values, {
					onSuccess: () => console.log("registered"),
				})
			}}
			error={register.error}
		>
			<Input autoComplete="new-password" placeholder="email" name="email" type="email" onChange={onChange} />
			<Input placeholder="name" name="name" onChange={onChange} />
			<Input type="password" placeholder="password" name="password" onChange={onChange} />
			<Button disabled={register.isPending} type="submit">
				Submit
			</Button>
		</Form>
	)
}

const LoginForm = () => {
	const login = useLogin()
	const { values, onChange } = useForm<LoginCredentials>()

	return (
		<Form
			title="Login"
			onSubmit={(e) => {
				e.preventDefault()
				login.mutate(values)
			}}
			error={login.error}
		>
			<Input autoComplete="new-password" placeholder="email" type="email" name="email" onChange={onChange} />
			<Input type="password" placeholder="password" name="password" onChange={onChange} />
			<Button disabled={login.isPending} type="submit">
				Submit
			</Button>
		</Form>
	)
}
