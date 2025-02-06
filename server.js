require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");

const app = express();

// Connect to MongoDB
connectDB();

// Set up GraphQL endpoint with GraphiQL UI enabled
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true 
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}, GraphQL at /graphql`);
});



