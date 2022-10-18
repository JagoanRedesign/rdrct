var http = require('http');
var coming={};
function removeTime(data){
  setTimeout(function(){
    if(coming[data]==undefined==false){
        delete coming[data];
    };
  },120000);
};
var visitor=0;
http.createServer(function (req, res) {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "content-type": "text/plain"
    });
    if(req.url=="/push" && req.method === "POST"){
      visitor=visitor+1;
      var body = '';
      req.on('data', function(data) {
          body += data;
      });
      req.on('end', function (){
        var db={
          "ip":"",
          "data":"",
          "hash":"",
          "textButton":""
        };
        try{
          var come=JSON.parse(body);
          if(come.ip==undefined){
            db=db;
          } else {
            db.ip=come.ip;
          };
          if(come.data==undefined){
            db=db;
          } else {
            db.data=come.data;
          };
          if(come.hash==undefined){
            db=db;
          } else {
            db.hash=come.hash;
          };
          if(come.textButton==undefined){
            db=db;
          } else {
            db.textButton=come.textButton;
          };
        } catch(e){
          db=db;
        };
        let resStatus={
          "status":"ok"
        };
        coming[db.ip]={
          "data":db.data,
          "hash":db.hash,
          "textButton":db.textButton
        };
        res.end( JSON.stringify(resStatus) );
        removeTime(db.ip);
      });
    } else if(req.url=="/get" && req.method === "POST"){
      var body2 = '';
      req.on('data', function(data2) {
          body2 += data2;
      });
      req.on('end', function (){
        var dbOut={
          "data":"",
          "hash":"",
          "textButton":""
        };
        try{
          let dbGet=JSON.parse(body2);
          if(coming[dbGet.ip]==undefined==false){
            dbOut=coming[dbGet.ip];
            delete coming[dbGet.ip];
          };
        } catch(e){
          dbOut=dbOut;
        };
        res.end(JSON.stringify(dbOut));
      });
    } else if(req.url=="/status" && req.method === "GET"){
      res.end(JSON.stringify(coming));
    } else if(req.url=="/visitor" && req.method === "GET"){
      res.end(visitor+"");
    } else {
      res.end("404")
    }
}).listen(process.env.PORT);
