const express = require("express")
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");
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

//Models
const Role = require("./models/role");
const User = require("./models/user");
const File = require("./models/file");
const Land = require("./models/land");

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

app.listen(PORT, async () => {
    console.log(` App is listen at port ${PORT}`)
    try {
        await connection.authenticate()
        await Role.sync()
        await User.sync()
        await Land.sync()
        await File.sync()
        console.log("Successfully connection")
    }catch (e) {
        console.log("Error during BD connection", e)
    }
    dotenv.config();
})
