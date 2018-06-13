const get = require('simple-get')
const from = require('from2')
const url = require('url')
const parseLink = require('parse-link-header')

module.exports = createStream

function createStream (opts) {
  if (!opts) opts = {}

  var lastLink = false
  var nextLink = url.format({
    protocol: 'https',
    hostname: 'api.github.com',
    pathname: '/repos/nodejs/node/commits',
    query: defined({
      per_page: '30',
      since: opts.since,
      until: opts.until,
      sha: opts.sha,
      author: opts.author
    })
  })

  const headers = opts.token
    ? {'User-Agent': 'node-core-commit-stream', 'Authorization': 'token ' + opts.token}
    : {'User-Agent': 'node-core-commit-stream'}

  const stream = from.obj(read)
  return stream

  function read (size, cb) {
    if (lastLink) return cb(null, null)

    get.concat({
      url: nextLink,
      headers,
      json: true
    }, function (err, res, body) {
      if (err) return cb(err)

      const link = parseLink(res.headers.link || '')
      nextLink = link && link.next && link.next.url
      lastLink = !nextLink

      if (body.message) return cb(new Error(body.message))
      if (!body.length) return read(size, cb)

      for (var i = 0; i < body.length - 1; i++) {
        stream.push(parse(body[i]))
      }

      cb(null, parse(body[body.length - 1]))
    })
  }
}

function defined (opts) {
  const map = {}
  for (const key of Object.keys(opts)) {
    if (opts[key]) map[key] = opts[key]
  }
  return map
}

function parse (opts) {
  const lines = opts.commit.message.split('\n')
  const subsystems = ((lines[0] || '').match(/^([^:]+):/) || [])[1]
  const pullRequest = (opts.commit.message.match(/PR-URL: (.+)/) || [])[1]
  const reviewedBy = []

  for (const line of lines) {
    const m = line.match(/Reviewed-By: ([^<]+) <([^>]+)>/)
    if (!m) continue
    reviewedBy.push({
      name: m[1],
      email: m[2]
    })
  }

  return {
    title: lines[0],
    sha: opts.sha,
    author: opts.commit.author,
    committer: opts.commit.committer,
    subsystems: subsystems && subsystems.split(/,/).map(s => s.trim()),
    pullRequest,
    reviewedBy,
    message: opts.commit.message
  }
}
