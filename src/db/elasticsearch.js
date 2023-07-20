import elasticsearch from "elasticsearch";
let port = 9200;
// if (process.env.DB_PORT && isNumber(process.env.DB_PORT)) {
//   port = parseInt(port, 10);
// }
const config = {
  host: process.env.ES_HOST || "localhost",
  port: process.env.ES_PORT || port,
  index: process.env.ES_INDEX || "wms"
};

let client = new elasticsearch.Client({
  host: `${config.host}:${config.port}`
  // log: 'trace'
});

if (!!process.env.ES_URL) {
  client = new elasticsearch.Client({
    host: process.env.ES_URL
    // log: 'trace'
  });
}

// client.indices.create(
//   {
//     index: "blog"
//   },
//   function(err, resp, status) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("create", resp);
//     }
//   }
// );

module.exports.elasticsearch = client;
