var nconf = require('nconf')
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var sqlite3 = require('sqlite3').verbose();

nconf.argv()
 	 .env()
     .file({ file: 'production.json' })
	 .file({ file: 'dev.json' });

PodcastImporter = function() {
  console.log(nconf.get('database:username'));
  this.db= new Db(nconf.get('database:name'), new Server(nconf.get('database:host'), nconf.get('database:port'), {auto_reconnect: true}, {}), {safe:false});
  this.db.open(function(err,data){
     if(data){
		if(nconf.get('database:username')){
			console.log("database authentication required");
			data.authenticate(nconf.get('database:username'), nconf.get('database:password'), function(err2,data2){
	             if(data2){
	                 console.log("Database opened");
	             }
	             else{
	                 console.log(err2);
	             }
	         });	
		}	
		else{
			console.log("no authentication required");
		}
      }
      else{
           console.log(err);
      }
   });
};

PodcastImporter.prototype.close = function() {
    this.db.close();
	console.log("db close called!");
};

var sqlitePath = nconf.get('import:importDirectory') + '/' + nconf.get('import:podcasts:dbfile');
console.log(sqlitePath);

var usersDB = new sqlite3.Database(sqlitePath);
usersDB.serialize(function() {
	usersDB.each("select ZIMAGEURL from ZPODCAST;", function(err, row) {
   		console.log(row.ZIMAGEURL);
	});
});

usersDB.close();
//process.exit(0); // this should not be necessary


