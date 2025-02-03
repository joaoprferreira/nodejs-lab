const http = require('http')
const { URL } = require('url')

const UserController = require('./controllers/UserController')

const routes = require('./routes')

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`)
  console.log(parsedUrl)

  let { pathname } = parsedUrl
  let id = null

  const splitEndpoint = pathname.split('/').filter(Boolean)

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`
    id = splitEndpoint[1]
  }

  console.log(`Request method: ${request.method} | Endpoint: ${pathname}`)

  const route = routes.find(
    (routesObject) =>
      routesObject.endpoint === pathname &&
      routesObject.method === request.method
  )

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams)
    request.params = { id }

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'content-type': 'application/json' })
      response.end(JSON.stringify(body))
    }

    route.handler(request, response)
  } else {
    response.writeHead(404, { 'content-type': 'text/html' })
    response.end(`Cannot ${request.method} ${pathname}`)
  }
})

server.listen(3000, () =>
  console.log('Server started at http://localhost:3000')
)
