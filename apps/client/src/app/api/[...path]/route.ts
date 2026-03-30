import { NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ path: string[] }> };
const base = process.env.SERVER_URL ?? 'http://localhost:3001';

const proxy = async (req: Request, { params }: RouteContext) => {
	try {
		const { path } = await params;
		const url = new URL(path.join('/'), `${base}/`);

		return fetch(new Request(url, req));
	} catch {
		return NextResponse.json({ status: 502 });
	}
};

export { proxy as GET, proxy as POST };
