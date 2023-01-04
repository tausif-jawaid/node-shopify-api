const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");
require('dotenv').config();

const token = process.env.ACCESS_TOKEN;

//get all workouts

const getProduct = async (req, res) => {
  axios({
    url: "https://apna-star-store.myshopify.com/admin/api/2022-04/products.json",
    method: "get",
    headers: {
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": token,
      "Accept-Encoding": "gzip,deflate,compress"
    }
  }).then(response => {
    res.status(200).json(response.data);
  }).catch((err) => {
    res.status(500).json({ message: err });
  });
};



// const readCsv = async () => {
//   const results = [];
//   await fs.createReadStream("./meta_info.csv")
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", () => {
//       //console.log(results);
//       return results;
//     });
// }


module.exports = {
  getProduct
};
