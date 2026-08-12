import fs from 'node:fs/promises'
import path from 'node:path'

export function localContentApi(contentFile) {
  const resolvedFile = path.resolve(contentFile)

  return {
    name: 'hri-local-content-api',
    configureServer(server) {
      server.middlewares.use('/api/content', async (request, response) => {
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Cache-Control', 'no-store')

        try {
          if (request.method === 'GET') {
            response.end(await fs.readFile(resolvedFile, 'utf8'))
            return
          }

          if (request.method === 'PUT') {
            let body = ''
            for await (const chunk of request) body += chunk
            const content = JSON.parse(body)
            if (!content || content.version !== 1 || typeof content.pages !== 'object') {
              response.statusCode = 400
              response.end(JSON.stringify({ error: 'Invalid content document.' }))
              return
            }

            content.updatedAt = new Date().toISOString()
            await fs.writeFile(resolvedFile, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
            response.end(JSON.stringify(content))
            server.ws.send({ type: 'full-reload' })
            return
          }

          response.statusCode = 405
          response.end(JSON.stringify({ error: 'Method not allowed.' }))
        } catch (error) {
          response.statusCode = 500
          response.end(JSON.stringify({ error: error.message }))
        }
      })
    },
  }
}
