const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");
const reader = require('xlsx')
require('dotenv').config();

const token = process.env.ACCESS_TOKEN;
const filePath = './meta_info.xlsx';

const getMetafield = async (req, res) => {
    const product_id = req.params.id;
    axios({
        url: "https://apna-star-store.myshopify.com/admin/api/2022-10/products/" + product_id + "/metafields.json",
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
}

const countMetafields = async (req, res) => {
    product_id = req.params.id;
    axios({
        url: "https://apna-star-store.myshopify.com/admin/api/2022-10/products/" + product_id + "/metafields/count.json",
        method: "get",
        headers: {
            "Content-Type": "application/graphql",
            "X-Shopify-Access-Token": token,
            "Accept-Encoding": "gzip,deflate,compress"
        },
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
const createMetafields = async (req, res) => {
    const data = readCsv(filePath);
    const logs = {};
    let fail = 0;
    let success = 0;
    let count = 0;
    var time = 1000;
    // console.log(data)
    data.map(item => {
        
        let data = {
            metafield: {
                name: item.name,
                namespace: item.namespace,
                key: item.key,
                value: item.value,
                type: item.type,
                owner_type: "Product",
            }
        }
        setTimeout(() => {
        axios({
            url: "https://apna-star-store.myshopify.com/admin/api/2022-10/products/" + item.id + "/metafields.json",
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": token,
                "Accept-Encoding": "gzip,deflate,compress"
            },
            data: JSON.stringify(data)
        }).then(response => {
            success++;
            console.log(`count in success ${success}`)
            logs['dataResponse' + count] = response.data
        }).catch((err) => {
            fail++;
            console.log(`count in failure ${fail}, ${err}`)
            logs['errorAt' + count] = err.data
        });
    }, time * count);
    count++;

    })
    //console.log((logs));
    res.status(200).json( {message: 'Data Succesfully Imported,'} );

};


// create new metafields for specific product
// const createMetafields = async (req, res) => {

//     const data = {
//         metafield: {
//             name: "Employee Price",
//             namespace: "custom",
//             key: "Employee_Price",
//             value: 30,
//             type: "multi_line_text_field",
//             description : "Something for Product",
//             owner_type: "Product"
//         }
//     }

//     axios({
//         url: "https://apna-star-store.myshopify.com/admin/api/2022-10/products/6907102494856/metafields.json",
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//             "X-Shopify-Access-Token": token,
//             "Accept-Encoding": "gzip,deflate,compress"
//         },
//         data: JSON.stringify(data)
//     }).then(response => {
//         res.status(200).json(response.data);
//     }).catch((err) => {
//         res.status(500).json({ message: err });
//     });
// };

module.exports = {
    countMetafields,
    getMetafield,
    createMetafields
};