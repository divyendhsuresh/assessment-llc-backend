const { EntitySchema } = require("typeorm");
const UserHomeRelation = require("./UserHomeRelation");

const User = new EntitySchema({
    name: "User",
    columns: {
        username: {
            type: "varchar",
            primary: true
        },
        email: {
            type: "varchar",
            unique: true
        }
    },
    relations: {
        homes: {
            type: "one-to-many",
            target: "UserHomeRelation",
            inverseSide: "user"
        }
    }
});

module.exports = User;
