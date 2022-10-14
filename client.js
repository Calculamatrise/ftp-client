import Client from "ftp";

export const client = new Client();

// client.on('ready', function() {
//     client.list(function(err, list) {
//         if (err) throw err;
//         console.dir(list);
//         client.end();
//     });
// });

export default client;