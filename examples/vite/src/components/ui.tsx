import type * as React from "react"

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			{...props}
			style={{
				fontSize: "1rem",
				borderRadius: "4px",
				background: "white",
				border: "1px solid black",
				cursor: "pointer",
			}}
		/>
	)
}

export const Form = ({
	title,
	children,
	onSubmit,
	error,
}: {
	title: string
	children: React.ReactNode
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	error: unknown
}) => {
	return (
		<div style={{ marginBottom: "32px" }}>
			<h2>{title}</h2>
			<form
				onSubmit={onSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "16px",
				}}
			>
				{children}
			</form>

			{error && <div style={{ color: "tomato" }}>{JSON.stringify(error, null, 2)}</div>}
		</div>
	)
}

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<input
			{...props}
			style={{
				border: "1px solid #ccc",
				fontSize: "0.8rem",
				borderRadius: "4px",
				padding: "8px",
			}}
		/>
	)
}

export const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "strech",
					fontFamily: "sans-serif",
					border: "1px solid black",
					width: "100%",
					maxWidth: "480px",
					margin: "0 auto",
					padding: "32px",
					gap: "16px",
				}}
			>
				{children}
			</div>
		</div>
	)
}
