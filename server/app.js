const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const app = express();
const { json, urlencoded} = express;
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/files", (req, res) => {

  const { download_path, file }  = req.query;
  const filepath = path.join(
    __dirname,
    download_path,
    file
  );

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    return res.status(404).json({ message: "File Not Found or Moved" });
  }
});

const PORT = process.env.PORT || 4000;
var server = app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
