const MongoClient = require("mongodb").MongoClient;
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {GraphQLSchema} = require('graphql');
const {queryType} = require('./query.js');
const ObjectId = require("mongodb").ObjectID;

const env = require('dotenv').config();

const CONNECTION_URL = `mongodb+srv://${env.parsed.DB_USER}:${env.parsed.DB_PASS}@denzelmovies-696nb.mongodb.net/test?retryWrites=true`;
const DATABASE_NAME = "denzelmovies";

//setting up the port number and express app
const port = 8080;
const app = express();

// Define the Schema
const schema = new GraphQLSchema({ query: queryType });

//Setup the nodejs GraphQL server
//Create Database connection
MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log(error);
        throw error;
    }
    //console.log('Connected');
    database = client.db(DATABASE_NAME);
    collection = database.collection("movies");
    //console.log("Connected to `" + DATABASE_NAME + "`!");
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
        context : {
            collection : collection
        }
    }));
    console.log('Server Ready');
});


app.listen(port);
