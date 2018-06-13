const createStream = require('./')

createStream()
  .on('data', console.log)
