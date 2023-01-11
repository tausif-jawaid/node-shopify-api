const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");
require('dotenv').config();
const reader = require('xlsx')
filePath = './product_info.xlsx';

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

const readCsv = (filePath) => {
  const file = reader.readFile(filePath)
  let data = []
  const sheets = file.SheetNames
  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
      data.push(res)
    })
  }
  return data;
}

// create new metafields for specific product
const createProducts = async (req, res) => {
  const data = readCsv(filePath);
  const logs = {}
  let count = 0
  // console.log(data)
  data.map(item => {
    let data = {
      product: {
        title: item.title,
        body_html: item.body_html,
        vendor: item.vendor,
        handle: item.handle,
        product_type: item.product_type,
      }
    }
    axios({
      url: "https://apna-star-store.myshopify.com/admin/api/2023-01/products.json",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
        "Accept-Encoding": "gzip,deflate,compress"
      },
      data: JSON.stringify(data)
    }).then(response => {
      count++;
      logs['dataResponse' + count] = response.data
    }).catch((err) => {
      logs['errorAt' + count] = err.data
    });
  })
  //console.log((logs));
  res.status(200).json({ message: 'Data Succesfully Imported' });

};

// const createProducts = async (req, res) => {
//   const data = {
//     product: {
//       title: 'Burton Custom Freestyle',
//       body_html: '<strong>Good snowboard!</strong>',
//       vendor: 'Burton',
//       handle: 'burton-custom-freestyle',
//       product_type: 'Snowboard',
//     }
//   }

//   axios({
//     url: "https://apna-star-store.myshopify.com/admin/api/2023-01/products.json",
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Shopify-Access-Token": token,
//       "Accept-Encoding": "gzip,deflate,compress"
//     },
//     data: JSON.stringify(data)
//   }).then(response => {
//     res.status(200).json(response.data);
//   }).catch((err) => {
//     res.status(500).json({ message: err });
//   });
// };

module.exports = {
  getProduct,
  createProducts
};
