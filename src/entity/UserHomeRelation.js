const { EntitySchema } = require("typeorm");
const User = require("./User");
const Home = require("./Home");

const UserHomeRelation = new EntitySchema({
    name: "UserHomeRelation",
    columns: {
        username: {
            type: "varchar",
            primary: true
        },
        street_address: {
            type: "varchar",
            primary: true
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "username"
            },
            inverseSide: "homes"
        },
        home: {
            type: "many-to-one",
            target: "Home",
            joinColumn: {
                name: "street_address"
            },
            inverseSide: "users"
        }
    }
});

module.exports = UserHomeRelation;
