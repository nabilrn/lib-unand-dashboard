/// <reference types="vite/client" />

declare module '*.json' {
	const value: any;
	export default value;
}

// Extend ImportMetaEnv here only if the frontend adds build-time variables later.
