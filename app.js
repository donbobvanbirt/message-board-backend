const PORT = 8000;

const http = require('http');
const anyBody = require('body/any');
const fs = require('fs');
const uuid = require('uuid');

const filename = 'messages.json';



const server = http.createServer((req, res) => {
  anyBody(req, (err, body) => {
    let { author, text } = body;
    let { url, method } = req;
    let urlPath = url.split('/');

    switch (method) {
// ---------------------------- Receive Messages ---------------------------- //
      case 'GET':
        // let urlPath = url.split('/');


        if (urlPath[1] === 'messages') {
          fs.readFile(filename, (err, buffer) => {
            let messagesStr = JSON.parse(buffer);
            let messages = JSON.parse(messagesStr);

            if(urlPath[2]) {
              let message = messages.filter(message => {
                return message.id === urlPath[2]
              })

              res.end(JSON.stringify(message));
            } else {
              res.end(JSON.stringify(messages));
            }
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
            let messagesStr = JSON.parse(buffer);
            let messages = JSON.parse(messagesStr);

            if(author && text) {
              body.id = uuid();
              messages.push( body );
              // console.log('messages:', typeof(messages));
              // console.log('messages:', messages);

              fs.writeFile(filename, JSON.stringify(JSON.stringify(messages)), err => {
              })
              res.end('message added');
            } else {
              res.end('Please include author and text')
            }
          })

        } else {
          res.statusCode = 404;
          res.end(`Not found`);
        }
        break;

// -------------------------- // Delete Messages // -------------------------- //
      case 'DELETE':

        if (urlPath[1] === 'messages' && urlPath[2]) {
          fs.readFile(filename, (err, buffer) => {
            let messagesStr = JSON.parse(buffer);
            let messages = JSON.parse(messagesStr);

            let newMessages = messages.filter(message => {
              return message.id !== urlPath[2]
            })

            fs.writeFile(filename, JSON.stringify(JSON.stringify(newMessages)), err => {
            })
            res.end('message deleted');

          })

        } else {
          res.statusCode = 404;
          res.end(`Not found`);
        }

        break;

// -------------------------- // Update message // -------------------------- //
      case 'PUT':

      if (urlPath[1] === 'messages' && urlPath[2]) {
        fs.readFile(filename, (err, buffer) => {
          let messagesStr = JSON.parse(buffer);
          let messages = JSON.parse(messagesStr);
          let updatedMessage = {};

          let oldMessage = messages.filter(message => {
            return message.id === urlPath[2]
          })

          let messagesMinus = messages.filter(message => {
            return message.id !== urlPath[2]
          })

          // let { author, text, id } = oldMessage[0];

          if(author) {
            updatedMessage.author = author;
          } else {
            updatedMessage.author = oldMessage[0].author;
          }
          if(text) {
            updatedMessage.text = text;
          } else {
            updatedMessage.text = oldMessage[0].text;
          }
          updatedMessage.id = oldMessage[0].id;

          console.log('updatedMessage:', updatedMessage);

          messagesMinus.push( updatedMessage );

          fs.writeFile(filename, JSON.stringify(JSON.stringify(messagesMinus)), err => {
          })
          res.end('message updated');

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



//

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
