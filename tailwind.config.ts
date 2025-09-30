import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
			},
			colors: {
				/* Semantic Design System Tokens */
				surface: {
					1: 'hsl(var(--surface-1))',
					2: 'hsl(var(--surface-2))',
				},
				text: {
					primary: 'hsl(var(--text-primary))',
					muted: 'hsl(var(--text-muted))',
				},
				border: {
					DEFAULT: 'hsl(var(--border))',
					strong: 'hsl(var(--border-strong))',
				},
				action: {
					DEFAULT: 'hsl(var(--action))',
					foreground: 'hsl(var(--action-foreground) / 1)',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground) / 1)',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground) / 1)',
				},
				danger: {
					DEFAULT: 'hsl(var(--danger))',
					foreground: 'hsl(var(--danger-foreground) / 1)',
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground) / 1)',
				},
				
				/* Legacy Compatibility (gradually migrate away) */
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				brand: {
					DEFAULT: 'hsl(var(--brand))',
					foreground: 'hsl(var(--brand-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-brand': 'var(--gradient-brand)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-surface': 'var(--gradient-surface)',
			},
			boxShadow: {
				'subtle': 'var(--shadow-subtle)',
				'moderate': 'var(--shadow-moderate)',
				'prominent': 'var(--shadow-prominent)',
				'dramatic': 'var(--shadow-dramatic)',
			},
			transitionTimingFunction: {
				'fast': 'var(--transition-fast)',
				'smooth': 'var(--transition-smooth)',
				'bounce': 'var(--transition-bounce)',
			},
			borderRadius: {
				'2xl': 'var(--radius)',
				'xl': 'calc(var(--radius) - 2px)',
				'lg': 'calc(var(--radius) - 4px)',
				'md': 'calc(var(--radius) - 6px)',
				'sm': 'calc(var(--radius) - 8px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
