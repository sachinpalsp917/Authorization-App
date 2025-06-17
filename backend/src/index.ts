import express from "express";

const app = express();

app.listen(4004, () => {
  console.log(`server is running in port 4004 in development enviourment`);
});
