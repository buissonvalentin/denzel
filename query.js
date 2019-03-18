const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const { movieType } = require('./types.js');
const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';


function PopulateTable(source, args, context) {
    var collection = context.collection;
    async function AwaitPopulate() {
        var promise = new Promise((resolve, reject) => {
            imdb(DENZEL_IMDB_ID).then((movies) => {
                collection.insert(movies, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(`Populating Successful (${movies.length} movies added)`);
                });
            });
        });

        var result = await promise;
        return result;
    }

    return AwaitPopulate();
};

function getRandomMovie(source, args, context) {
    var collection = context.collection;

    async function AwaitMovie() {
        var promise = new Promise((resolve, reject) => {
            collection.find({ metascore: { $gte: 70 } }).toArray((error, result) => {
                if (error) {
                    reject(error)
                }
                var index = Math.floor(Math.random() * result.length);
                resolve(result[index]);
            });
        });

        let movie = await promise;
        return movie;
    }
    return AwaitMovie();
};

function getMovie(source, args, context) {
    var collection = context.collection;
    var id = args.id;
    async function AwaitGetMovie() {
        var promise = new Promise((resolve, reject) => {
            collection.find({ id: id }).toArray((error, result) => {
                if (error) {
                    reject(error);
                }
                if (result.length > 0) {
                    resolve(result[0]);
                }
                else {
                    reject(`no match for id : ${id}`);
                }

            });
        });
        return await promise;;
    }

    return AwaitGetMovie();
};

function Search(source, args, context) {
    var collection = context.collection;
    var limit = args.limit ? args.limit : 5;
    var metascore = args.metascore ? args.metascore : 0;
    console.log(`l : ${limit}, m : ${metascore}`);

    async function AwaitSearch() {
        var promise = new Promise((resolve, reject) => {
            collection.aggregate([{ $match: { metascore: { $gte: metascore } } }, { $limit: limit }, { $sort: { metascore: -1 } }]).toArray((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        return await promise;
    }

    return AwaitSearch();
};

function Review(source, args, context){
    var collection = context.collection;
    var review = args.review;
    var date = args.date;
    var id = args.id;

    async function AwaitPost(){
        var promise = new Promise((resolve, reject) =>{
            collection.update({id: id}, {$set: {"date": date, 'review' : review}}, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });

        return await promise;
    }

    return AwaitPost();
};


//Define the Query
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        randomMovie: {
            type: movieType,
            resolve: getRandomMovie
        },
        populate: {
            type: GraphQLString,
            resolve: PopulateTable
        },
        movie: {
            type: movieType,
            args: {
                id: { type: GraphQLString}
            },
            resolve: getMovie
        },
        searchMovies: {
            type: new GraphQLList(movieType),
            args: {
                limit: { type: GraphQLInt },
                metascore: { type: GraphQLInt }
            },
            resolve: Search
        },
        postReview: {
            type: GraphQLString,
            args: {
                date: {type: new GraphQLNonNull(GraphQLString)},
                review: {type: new GraphQLNonNull(GraphQLString)},
                id : {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: Review
        }
    }
});



exports.queryType = queryType;
