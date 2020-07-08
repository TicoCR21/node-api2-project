const express = require( "express" );
const postsRouter = require( "./posts/postsRouter" );
const server = express();

server.use( express.json() );


server.get( "/", ( req, res ) =>
{
  res.send( "Server Running..." );
} );

server.use( "/api/posts", postsRouter )

server.listen( 5000, () => { console.log( "Server Running..." ) } );