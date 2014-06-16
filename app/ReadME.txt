Leo 06/16/14 0800
-------------------------------------------------------------------------------------------------------
Made two commits today, started online battle feature using node.js

At this moment all players logged in are playing on the same board, there's no pairing yet. That is to say, any move made by any player will be broadcasted to all other people.

I also made some modification to gameContrller, but the friendController was not touched. The onlineController is basically the copy of gameController with addition of talking to server.


Currently the online battle server need to be started separatedly by:
  node server.js

Before runing that you need to install the following module:
  npm install socket.io

Other modules worth checking out are:
  express: for serving files, so that later we can integrate this server into the main project
  redis: persistent database
  xml2json: currently I'm unable to install this, it's working without it, but maybe need to figure it out

