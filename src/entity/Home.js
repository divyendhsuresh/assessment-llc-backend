const { EntitySchema } = require("typeorm");
const UserHomeRelation = require("./UserHomeRelation");

const Home = new EntitySchema({
    name: "Home",
    columns: {
        street_address: {
            type: "varchar",
            primary: true
        },
        state: {
            type: "varchar"
        },
        zip: {
            type: "varchar"
        },
        sqft: {
            type: "int"
        },
        beds: {
            type: "int"
        },
        baths: {
            type: "int"
        },
        list_price: {
            type: "decimal",
            precision: 15,
            scale: 2
        }
    },
    relations: {
        users: {
            type: "one-to-many",
            target: "UserHomeRelation",
            inverseSide: "home"
        }
    }
});

module.exports = Home;
