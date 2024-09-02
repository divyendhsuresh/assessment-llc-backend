const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("../data-source");
const User = require("../entity/User");
const Home = require("../entity/Home");
const UserHomeRelation = require("../entity/UserHomeRelation");
const router = express.Router();



router.get("/user/find-all", async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/home/find-by-user", async (req, res) => {
    const { username, page = 1 } = req.query;
    const pageSize = 50;
    const skip = (page - 1) * pageSize;
    // console.log(username);
    try {
        const userHomeRelationRepository = AppDataSource.getRepository(UserHomeRelation);
        const homes = await userHomeRelationRepository
            .createQueryBuilder("userHomeRelation")
            .innerJoinAndSelect("userHomeRelation.home", "home")
            .innerJoin("userHomeRelation.user", "user")
            .where("user.username = :username", { username })
            .orderBy("home.street_address", "ASC")
            .skip(skip)
            .take(pageSize)
            .getMany();

        const homeDetails = homes.map(userHomeRelation => userHomeRelation.home);
        res.json(homeDetails);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch homes by user" });
    }
});

router.get('/home/:street_address', async (req, res) => {
    try {
        const { street_address } = req.params;
        console.log(street_address);

        const userHomeRelationRepository = AppDataSource.getRepository(UserHomeRelation);

        const users = await userHomeRelationRepository
            .createQueryBuilder("userHomeRelation")
            .innerJoinAndSelect("userHomeRelation.user", "user")
            .innerJoin("userHomeRelation.home", "home")
            .where("home.street_address = :street_address", { street_address })
            .orderBy("user.username", "ASC")
            .getMany();

        // Extract and return the user details
        const userDetails = users.map(userHomeRelation => userHomeRelation.user);

        return res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error fetching users for home:", error);
        return res.status(500).json({ message: "Error fetching users for home" });
    }
});

router.post('/home/edituser', async (req, res) => {
    const { username, email, street_address } = req.body;
    // console.log(req.body);
    if (!username || !email || !street_address) {
        return res.status(400).json({ error: "Username, email, and street address are required" });
    }

    const queryRunner = AppDataSource.createQueryRunner();

    try {
        // Start a transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // console.log("test - 1 ");
        // Check if the user already exists
        let user = await queryRunner.manager.findOne(User, { where: { username } });

        // console.log(user);
        // console.log("test - 2");

        // if (user) {
        //     // If the user exists, check if the email needs to be updated
        //     if (user.email !== email) {
        //         user.email = email;
        //         await queryRunner.manager.save(user);
        //     } 
        // }
        if (!user) {
            // If the user does not exist, create a new user
            // user = new User();
            // user.username = username;
            // user.email = email;
            // await queryRunner.manager.save(user);
            await queryRunner.manager.insert(User, { username, email });
            user = await queryRunner.manager.findOne(User, { where: { username } });
            console.log(user);
        }

        // Check if the home exists in the home table
        const home = await queryRunner.manager.findOne(Home, { where: { street_address } });
        // console.log(home);
        if (!home) {
            throw new Error("Home not found");
        }

        // Check if the user is already associated with the home in user_home_relation
        const existingRelation = await queryRunner.manager.findOne(UserHomeRelation, {
            where: { user: user, home: home }
        });

        if (!existingRelation) {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(UserHomeRelation)
                .values({
                    user: user,
                    home: home
                })
                .execute();

        } else {
            return res.status(400).json({ error: "User is already associated with this home" });
        }

        // console.log("test - 5");

        // Commit the transaction
        await queryRunner.commitTransaction();
        // console.log("test = 6");
        res.status(200).json({ message: "User added to home successfully" });

    } catch (error) {
        console.error("Error adding user to home:", error);
        // Rollback the transaction if any error occurs
        await queryRunner.rollbackTransaction();

        res.status(500).json({ error: "Failed to add user to home" });
    } finally {
        // Release the query runner
        await queryRunner.release();
    }
});



module.exports = router;