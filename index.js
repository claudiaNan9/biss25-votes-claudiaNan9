// Express is a simple framework for building a Restful API
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


// this creates a middleware that takes the data and if it is in json
// it makes you read the body of the request
app.use(express.json());
app.use("/",express.static("./public")) ;



// When the client sends a requests, it will show the message
// It is called callback
app.get("/",(request,response) => {
    response.send("Hello World!");
});

// We need to structure the Votes and Talks project, which is: 
// Every talk has its unique name and votes, so a Dict (Map here)
//  structure would be ok

const votes = new Map();
// multiple talks 
let BASEURL = "/api/v1/talks"

//create Talks

app.post(BASEURL, (request,response) => {
    // get the data from the talk, body of the message 
    // of the request in JSON
    let talkID = request.body.talkID;

    if (votes.has(talkID)){
        response.sendStatus(409,"Conflict!");
    }
    else {
        votes.set(talkID, new Array());
        response.sendStatus(201, "Talk created successfully!");
    }

});

// Delete Talks 
app.delete(BASEURL+"/:talkID", (request,response) => {
   
    let talkID = request.params.talkID;

    if (votes.has(talkID)) {
        votes.delete(talkID);
        response.sendStatus(200,"Talk deleted.");
    } else {
        response.sendStatus(404, "Talk not found.");
    }
});

//Create votes for each talk 
app.post(BASEURL+"/:talkID/votes", (request,response) => {

    let talkID = request.params.talkID;
    let vote = request.body.value;

    if (votes.has(talkID)) {
        let talkVotes = votes.get(talkID);
        talkVotes.push(vote);
        response.sendStatus(201,"Vote created.");
    } else {
        response.sendStatus(404, "Talk not found.");
    }
});

//Obtain the result for a talk 
app.get("/api/v1/talks/:talkId/votes/results", (request, response) => {


  let talkId = request.params.talkId;


  if (!votes.has(talkId)){
        response.sendStatus(404,"Not found");


    }else{


        let results = {
            count: 0,
            average: 0
        };


          let talkVotes = votes.get(talkId);


          results.count = talkVotes.length;


          if (talkVotes.length > 0){
              let sum = talkVotes.reduce((r, n) => { return r + n; });
              let average = sum / talkVotes.length;
              results.average = average;
          }


        response.send(results);
    }
 
});

// It starts the server, returns a message to confirm it's running
app.listen(port,() => {
    console.log("Server is running on port" +port);
});
