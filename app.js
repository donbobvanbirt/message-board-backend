const PORT = 8000;

const http = require('http');
const anyBody = require('body/any');
const fs = require('fs');

const filename = 'messages.json';



const server = http.createServer((req, res) => {
  anyBody(req, (err, body) => {
    let { url, method } = req;

    switch (method) {
// ---------------------------- Receive Messages ---------------------------- //
      case 'GET':

        if (url === '/messages') {
          fs.readFile(filename, (err, buffer) => {
            let messages = JSON.parse(buffer);
            // console.log("messages", messages)
            // res.end(JSON.stringify(messages))
            res.end(buffer);
          })
        } else {
          res.statusCode = 404;
          res.end(`Not found`);
        }

        break;

// ----------------------------- Add new message ----------------------------- //
      case 'POST':

        if(url === '/messages') {

          fs.readFile(filename, (err, buffer) => {

            let messages = JSON.parse(buffer);

            messages.push( body );

            fs.writeFile(filename, JSON.stringify(messages), err => {

              console.log('done!');

            })
            res.end('message added');
          })

        } else {
          res.statusCode = 404;
          res.end(`Not found`);
        }


        break;
// -------------------------------- // --- // -------------------------------- //
      default:
        res.statusCode = 404;
        res.end(`Not found`);
    }





    // console.log('body:', body);
    //res.end(JSON.stringify(method));
  });
});

server.listen(PORT, err => {
  console.log(err || `Server is listening on port ${PORT}`)
})



// const fs = require('fs');
//
// const filename = 'messages.json';
//
// fs.readFile(filename, (err, buffer) => {
//
//   let messages = JSON.parse(buffer);
//
//   messages.push( Math.random() );
//
//   console.log("messages", messages)
//
//   fs.writeFile(filename, JSON.stringify(messages), err => {
//
//     console.log('done!');
//
//   })
// })
