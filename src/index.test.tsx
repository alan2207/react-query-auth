import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { configureAuth } from './index'

import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const renderApp = (children: ReactNode) => {
	const client = new QueryClient()
	return render(<QueryClientProvider client={client}>{children}</QueryClientProvider>)
}

const renderAppHook = <Result,>(hook: () => Result) => {
	const client = new QueryClient()
	return renderHook(hook, {
		wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
	})
}

beforeEach(() => {
	vi.resetAllMocks()
})

const user = {
	id: '1',
	name: 'Test User',
	email: 'user@mail.com',
}

const config = {
	userFn: vi.fn(),
	loginFn: vi.fn(),
	logoutFn: vi.fn(),
	registerFn: vi.fn(),
}

const { AuthLoader, useUser, useLogin, useRegister, useLogout } = configureAuth(config)

describe('useUser', () => {
	it('returns the authenticated user', async () => {
		config.userFn.mockResolvedValue(user)

		const { result } = renderAppHook(() => useUser())

		await waitFor(() => expect(result.current.data).toEqual(user))

		expect(config.userFn).toHaveBeenCalled()
	})
})

describe('useRegister', () => {
	it('calls the register function and sets the authenticated user on success', async () => {
		config.registerFn.mockResolvedValue(user)

		const registerCredentials = {
			name: 'Test User 2',
			email: 'user2@mail.com',
			password: 'password',
		}

		const { result } = renderAppHook(() => useRegister())

		act(() => {
			result.current.mutate(registerCredentials)
		})

		await waitFor(() => expect(config.registerFn).toHaveBeenCalledWith(registerCredentials))
		expect(result.current.data).toEqual(user)
	})
})

describe('useLogin', () => {
	it('calls the login function and sets the authenticated user on success', async () => {
		config.loginFn.mockResolvedValue(user)

		const loginCredentials = {
			email: 'user@mail.com',
			password: 'password',
		}

		const { result } = renderAppHook(() => useLogin())

		act(() => {
			result.current.mutate(loginCredentials)
		})

		await waitFor(() => expect(config.loginFn).toHaveBeenCalledWith(loginCredentials))
		expect(result.current.data).toEqual(user)
	})
})

describe('useLogout', () => {
	it('calls the logout function and removes the authenticated user on success', async () => {
		config.logoutFn.mockResolvedValue(true)

		const { result } = renderAppHook(() => useLogout())

		act(() => {
			result.current.mutate({})
		})

		await waitFor(() => expect(config.logoutFn).toHaveBeenCalled())
		expect(result.current.data).toEqual(true)
	})
})

describe('AuthLoader', () => {
	it('renders loading component when not yet fetched', () => {
		config.userFn.mockResolvedValue(null)
		renderApp(
			<AuthLoader renderLoading={() => <div>Loading...</div>} renderUnauthenticated={() => <div>Unauthenticated</div>}>
				Hello {user.name}!
			</AuthLoader>
		)

		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('renders unauthenticated component when authenticated user is null', async () => {
		config.userFn.mockResolvedValue(null)
		renderApp(
			<AuthLoader renderLoading={() => <div>Loading...</div>} renderUnauthenticated={() => <div>Unauthenticated</div>}>
				Hello {user.name}!
			</AuthLoader>
		)

		await waitFor(() => expect(screen.getByText('Unauthenticated')).toBeInTheDocument())
	})

	it('renders children when authenticated user is not null', async () => {
		const content = `Hello ${user.name}!`

		config.userFn.mockResolvedValue(user)

		renderApp(<AuthLoader renderLoading={() => <div>Loading...</div>}>{content}</AuthLoader>)

		await waitFor(() => expect(screen.getByText(content)).toBeInTheDocument())
	})
})
