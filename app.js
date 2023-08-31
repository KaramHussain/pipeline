const express = require('express')
require('dotenv').config();
const cors = require('cors')
const path=require("path")
const port = process.env.PORT || 3000

async function bootstrap() {
  const app = express();
  app.use(cors())
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(express.static("public/uploads"));
  
  app.get('/', (req, res) => {
    res.send({ projectName: 'NTU' })
  })

  app.use("/api", require("./routes/index"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
  app.listen(port);
  require("./config/db").databaseLoader();
  console.log(`Server is running at http://localhost:${port}`);
}
bootstrap();




