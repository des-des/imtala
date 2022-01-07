import fs from 'fs';
import path from 'path';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	let cachedQuery;

	const cacheLocation = 'github_introspection.json';

	try {
		cachedQuery = JSON.parse(fs.readFileSync(cacheLocation).toString());
	} catch (_) {}

	if (!cachedQuery) {
		console.log('get called');
		const response = await fetch('https://api.github.com/graphql', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer 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'
			}
		});

		const payload = await response.json();

		if (payload.errors) {
			for (let error of payload.errors) {
				console.error(error);
			}
			throw new Error('Introspection response contains errors');
		}
		fs.writeFileSync(cacheLocation, JSON.stringify(payload, null, 4));

		cachedQuery = payload;
	}

	return {
		body: cachedQuery.data,
		status: 200,
		headers: {
			['content-type']: 'application/json'
		}
	};
}
