const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const User = require("../models/User");
const Employee = require("../models/Employee");

// Define User Type
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

// Define Employee Type
const EmployeeType = new GraphQLObjectType({
    name: "Employee",
    fields: () => ({
        id: { type: GraphQLID },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLString },
        date_of_joining: { type: GraphQLString },
        department: { type: GraphQLString }
    })
});

// Define Queries
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // Fetch all users
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find();
            }
        },
        // Fetch all employees
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve() {
                return Employee.find();
            }
        },
        // Fetch employee by ID
        employeeById: {
            type: EmployeeType,
            args: { id: { type: GraphQLID } },
            resolve(_, args) {
                return Employee.findById(args.id);
            }
        },
        // Fetch employees by designation or department
        employeesByDesignationOrDepartment: {
            type: new GraphQLList(EmployeeType),
            args: { designation: { type: GraphQLString }, department: { type: GraphQLString } },
            resolve(_, args) {
                let query = {};
                if (args.designation) query.designation = args.designation;
                if (args.department) query.department = args.department;
                return Employee.find(query);
            }
        }
    }
});

// Define Mutations
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // User registration
        register: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, args) {
                await Promise.all([
                    check("username").notEmpty().withMessage("Username is required").run(args),
                    check("email").isEmail().withMessage("Invalid email format").run(args),
                    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").run(args)
                ]);

                const existingUser = await User.findOne({ email: args.email });
                if (existingUser) throw new Error("User already exists");

                const hashedPassword = await bcrypt.hash(args.password, 12);
                return new User({ username: args.username, email: args.email, password: hashedPassword }).save();
            }
        },
        // User login
        login: {
            type: GraphQLString,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, args) {
                await Promise.all([
                    check("email").isEmail().withMessage("Invalid email format").run(args),
                    check("password").notEmpty().withMessage("Password is required").run(args)
                ]);

                const user = await User.findOne({ email: args.email });
                if (!user) throw new Error("User not found");

                const isMatch = await bcrypt.compare(args.password, user.password);
                if (!isMatch) throw new Error("Invalid password");

                return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            }
        },
        // Add a new employee
        addEmployee: {
            type: EmployeeType,
            args: {
                first_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                gender: { type: new GraphQLNonNull(GraphQLString) },
                designation: { type: new GraphQLNonNull(GraphQLString) },
                salary: { type: new GraphQLNonNull(GraphQLString) },
                date_of_joining: { type: new GraphQLNonNull(GraphQLString) },
                department: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, args) {
                await Promise.all([
                    check("first_name").notEmpty().withMessage("First name is required").run(args),
                    check("last_name").notEmpty().withMessage("Last name is required").run(args),
                    check("email").isEmail().withMessage("Invalid email format").run(args),
                    check("salary").isNumeric().withMessage("Salary must be a number")
                        .custom(value => value >= 1000 || "Salary must be at least 1000").run(args)
                ]);

                return new Employee(args).save();
            }
        },
        // Update an existing employee
        updateEmployee: {
            type: EmployeeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                gender: { type: GraphQLString },
                designation: { type: GraphQLString },
                salary: { type: GraphQLString },
                date_of_joining: { type: GraphQLString },
                department: { type: GraphQLString }
            },
            async resolve(_, args) {
                await Promise.all([
                    check("email").optional().isEmail().withMessage("Invalid email format").run(args),
                    check("salary").optional().isNumeric().withMessage("Salary must be a number")
                        .custom(value => value >= 1000 || "Salary must be at least 1000").run(args)
                ]);

                return Employee.findByIdAndUpdate(args.id, args, { new: true });
            }
        },
        // Delete an employee
        deleteEmployee: {
            type: EmployeeType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(_, args) {
                return Employee.findByIdAndDelete(args.id);
            }
        }
    }
});

// Export GraphQL Schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
