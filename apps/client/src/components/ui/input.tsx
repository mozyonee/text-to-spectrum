'use client';

import type { InputHTMLAttributes } from 'react';

const baseClassName =
	'w-full border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:border-[var(--border-focus)]';

export default function Input({ className = '', style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={[baseClassName, className].filter(Boolean).join(' ')} style={style} {...props} />;
}
