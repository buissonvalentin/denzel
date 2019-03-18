const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt
} = require('graphql');

// Define Movie Type
movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        link: { type: GraphQLString },
        metascore: { type: GraphQLInt },
        year: { type: GraphQLInt },
        title: { type: GraphQLString },
        synopsis : {type: GraphQLString}
    }
});

exports.movieType = movieType;
