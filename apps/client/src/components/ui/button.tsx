'use client';

import type { ButtonHTMLAttributes } from 'react';

const baseClassName =
	'flex h-10 items-center justify-center border border-[var(--border)] px-6 text-xs tracking-widest text-[var(--text)] transition-colors duration-150 cursor-pointer hover:border-[var(--border-focus)] focus-visible:border-[var(--border-focus)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--border)]';

export default function Button({
	className = '',
	style,
	type = 'button',
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button type={type} className={[baseClassName, className].filter(Boolean).join(' ')} style={style} {...props} />
	);
}
