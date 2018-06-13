# node-core-commit-stream

A stream of structured commit messages from Node.js core sorted newest to oldest

```
npm install node-core-commit-stream
```

## Usage

``` js
const createStream = require('node-core-commit-stream')

const stream = createStream()

stream.on('data', function (data) {
  console.log(data)
})
```

Running the above will produce output similar to this:

```js
{ title:
   'worker,src: display remaining handles if `uv_loop_close` fails',
  sha: 'aa2304b8d5c53ba2d9710d8b8ed4482f3cbd1192',
  author:
   { name: 'Anna Henningsen',
     email: 'anna@addaleax.net',
     date: '2018-06-07T20:07:02Z' },
  committer:
   { name: 'Anna Henningsen',
     email: 'anna@addaleax.net',
     date: '2018-06-13T10:23:36Z' },
  subsystems: [ 'worker', 'src' ],
  pullRequest: 'https://github.com/nodejs/node/pull/21238',
  reviewedBy:
   [ { name: 'Tiancheng "Timothy" Gu',
       email: 'timothygu99@gmail.com' },
     { name: 'James M Snell', email: 'jasnell@gmail.com' },
     { name: 'Gus Caplan', email: 'me@gus.host' },
     { name: 'Ben Noordhuis', email: 'info@bnoordhuis.nl' },
     { name: 'Benjamin Gruenbaum', email: 'benjamingr@gmail.com' },
     { name: 'Colin Ihrig', email: 'cjihrig@gmail.com' } ],
  message:
   'worker,src: display remaining handles if `uv_loop_close` fails\n\nRight now, we crash the process if there are handles remaining\non the event loop when we exit (except for the main thread).\n\nThis does not provide a lot of information about causes, though;\nin particular, we don’t show which handles are pending and\nwho own them.\n\nThis patch adds debug output to these cases to help with the\nsituation.\n\nPR-URL: https://github.com/nodejs/node/pull/21238\nReviewed-By: Tiancheng "Timothy" Gu <timothygu99@gmail.com>\nReviewed-By: James M Snell <jasnell@gmail.com>\nReviewed-By: Gus Caplan <me@gus.host>\nReviewed-By: Ben Noordhuis <info@bnoordhuis.nl>\nReviewed-By: Benjamin Gruenbaum <benjamingr@gmail.com>\nReviewed-By: Colin Ihrig <cjihrig@gmail.com>' }
```

## API

#### `const rs = createStream([options])`

Create a new readable stream of commits.

Options include

```js
{
  token: optionalGithubToken
}
```

The stream will list all commits in Node.js core. Use `rs.destroy()` to stop it.

## License

MIT
