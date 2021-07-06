import mongoose from "mongoose"
import server from "./server.js"

const port = 3000

mongoose
  .connect(process.env.ATLAS_URL + "test", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Atlas!")
    server.listen(port, () => {
      console.log("Server listening on port 3000")
    })
  })
  .catch((error) => console.log(error))
