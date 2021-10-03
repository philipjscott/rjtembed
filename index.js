addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

function handleMeta(origin, searchParams) {
	const meta = []
	const oembed = {}
	for (const [key, value] of searchParams.entries()) {
		if (key === "title" || key === "theme") { // title is special and reserved
			continue
		}
		const entry = {}
		let prefix = ""
		let prop = ""
		for (let i = 0; i < key.length; i++) {
			const c = key.charAt(i)
			if (c.toLowerCase() !== c && c.toUpperCase() === c) {
				prefix = key.slice(0, i)
				prop = key.slice(i).toLowerCase()
				break
			}
		}
		if (prefix === "oe") { // oembed
			oembed[prop] = value
		} else {
			entry.prefix = prefix
			entry.prop = prop
			entry.value = value
			meta.push(entry)
		}
	}
	const title = searchParams.get("title") || ""
	const metaHTML = meta.map(m => `<meta content="${m.value}" property="${m.prefix}:${m.prop}">`).join("")
	let oembedHTML = ""
	if (Object.keys(oembed).length > 0) {
		const oembedQuery = new URLSearchParams(oembed).toString()
		oembedHTML = `<link type="application/json+oembed" href="${origin}/oembed?${oembedQuery}">`
	}
	let themeHTML = ""
	const theme = searchParams.get("theme")
	if (theme) {
		themeHTML = `<meta name="theme-color" content="#${theme}">`
	}
	const html = `
<!DOCTYPE html>
<html>
<head>
<title>${title}</title>
${metaHTML}
${themeHTML}
${oembedHTML}
</head>
</html>
`
	return new Response(html, {
		headers: {
			"content-type": "text/html;charset=UTF-8",
			"x-robots-tag": "noindex",
		},
	})
}

function handleOembed(searchParams) {
	const obj = {}
	for (const [key, value] of searchParams.entries()) {
		obj[key] = decodeURIComponent(value)
	}
	return new Response(JSON.stringify(obj), {
		headers: {
			"content-type": "application/json;charset=UTF-8"
		}
	})
}

function handleRequest(req) {
	const url = new URL(req.url)
	const { searchParams, pathname, origin } = url
	if (pathname.startsWith("/meta")) {
		return handleMeta(origin, searchParams)
	}
	if (pathname.startsWith("/oembed")) {
		return handleOembed(searchParams)
	}
	return new Response('API: /meta?title=meme&ogTitle=hello&ogDescription=hi', {
		headers: { 'content-type': 'text/plain' },
	})
}
