const express = require("express")
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const PORT = 3001

//Mysql Init
const connection = require("./database/connection");

//Require Routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const rolesRoutes = require("./routes/roles");
const landsRoutes = require("./routes/lands");
const filesRoutes = require("./routes/files");
const authenticate = require("./routes/middlewares/authenticate");
const path = require("path");

//Modules
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")))

//Modules Routes
app.use("/", indexRoutes)
app.use("/auth", authRoutes)
app.use("/users", authenticate, usersRoutes)
app.use("/roles", authenticate, rolesRoutes)
app.use("/lands", authenticate, landsRoutes)
app.use("/files", authenticate, filesRoutes)

app.listen(PORT, () => {
    console.log(`🚀 App is listen at port ${PORT}`)
    connection.connect((err) => {
        if (err) {
            console.log("Error during BD connection")
        } else {
            console.log("Successfully connection")
        }
    })
    dotenv.config();
})
