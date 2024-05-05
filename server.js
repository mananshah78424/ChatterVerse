const { ApolloServer } = require('apollo-server')
const {sequelize}=require("./models")
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolver")

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);

  sequelize.authenticate()
  .then(()=>console.log("Database connected"))
  .catch(err=>console.log(err))
});
