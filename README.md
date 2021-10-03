# embed

Deployed to https://embed.scotty.workers.dev/

### API

`/meta?fooBar=Baz` will render `<meta property="foo:bar" content="baz">`

There are three exceptions:

`/meta?title=blah` will render `<title>blah</title>`

`/meta?theme=ffffff` will render `<meta name="theme-color" content="#ffffff">`

`/meta?oeKey=Value` will render `<link type="application/json+oembed" href=".../oembed?key=value">`

Ie. use the "oe" prefix to set oembed values. All other prefixes will be used to render open graph meta tags.

### Full example

https://embed.scotty.workers.dev/meta?title=Hyperbeam&ogTitle=TestTitle&ogDescription=TestDescription&ogImage=https://hyperbeam.com/img/256x256.png&oeAuthor_name=Hyperbeam&oeAuthor_url=https://hyperbeam.com

