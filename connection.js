

const mongoClient = require('mongodb').MongoClient
const state = {
  db: null
}
module.exports.connect = function (done) {
  const url = process.env.DATABASE_URL || "mongodb+srv://gokulhansv:GOk%409846@cluster0.gzlmt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  const dbname = 'codesnippets'

  mongoClient.connect(url, (err, data) => {
    if (err) return done(err)
    state.db = data.db(dbname)
    done()
  })
}


module.exports.get = function () {
  return state.db
}
