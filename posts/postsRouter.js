const db = require( "../data/db" );
const express = require( "express" );
const router = express.Router();

/* =========== POST =========== */

router.post( "/", ( req, res ) =>
{
  if( !req.body.title || !req.body.contents )
    return res.status( 400 ).json( { errorMessage : "Please provide title and contents for the post." } );

  db.insert( req.body )
    .then( response => res.status( 201 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { error : "There was an error while saving the post to the database" } ) );
} );

router.post( "/:id/comments", ( req, res ) =>
{
  if( !req.body.text )
    return res.status( 400 ).json( { errorMessage : "Please provide text for the comment." } );

  db.findById( req.params.id )
    .then( response => 
      {
        if( response.length === 0 )
          return res.status( 404 ).json( { message : "The post with the specified ID does not exist." } );
        
        db.insertComment( { ...req.body, post_id : req.params.id } )
          .then( response2 => res.status( 201 ).json( { data : response2 } ) )
          .catch( () => res.status( 500 ).json( { error : "There was an error while saving the comment to the database" } ) );
      } )
    .catch( () => res.status( 500 ).json( { error : "The post information could not be retrieved." } ) );
} );


/* =========== GET =========== */

router.get( "/", ( req, res ) =>
{
  db.find()
    .then( response => res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { error : "The posts information could not be retrieved." } ) );
} );

router.get( "/:id", ( req, res ) =>
{
  db.findById( req.params.id )
    .then( response => response.length === 0 ? 
      res.status( 404 ).json( { message: "The post with the specified ID does not exist." } ) : 
      res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { error : "The post information could not be retrieved." } ) );
} );

router.get( "/:id/comments", ( req, res ) =>
{
  db.findPostComments( req.params.id )
    .then( response => response.length === 0 ?
      res.status( 404 ).json( { message : "The post with the specified ID has NO comments" } ) :
      res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { error : "The comments information could not be retrieved." } ) );

} );


/* =========== DELETE =========== */

router.delete( "/:id", ( req, res ) => 
{
  db.findById( req.params.id )
    .then( response => 
      {
        if( response.length === 0 )
          return res.status( 404 ).json( { message : "The post with the specified ID does not exist." } );

        db.remove( req.params.id )
          .then( response2 => res.status( 200 ).json( { data : response } ) )
          .catch( () => res.status( 500 ).json( { error : "The post could not be removed" } ) );
      } )
    .catch( () => res.status( 500 ).json( { error : "The post information could not be retrieved." } ) );
} );


/* =========== PUT =========== */

router.put( "/:id", ( req, res ) =>
{
  if( !req.body.title || !req.body.contents )
    return res.status( 400 ).json( { errorMessage : "Please provide title and contents for the post." } );
    
  db.update( req.params.id, req.body )
    .then( response => response !== 1 ? res.status( 404 ).json( { message : "The post with the specified ID does not exist." } ) : res.status( 200 ).json( { data : req.body } ) )
    .catch( () => res.status( 500 ).json( { error : "The post information could not be modified." } ) );
} );


module.exports = router;