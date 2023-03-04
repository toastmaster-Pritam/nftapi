const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json()); //middle ware to read data from body of post request

const port = 3000;

// app.get("/", (req, res) =>
//   res.status(200).json({
//     message: "Hello I am nft marketplace api",
//     api: "NFT Marketplace",
//   })
// );

// app.post("/", (req, res) =>
//   res.status(201).json({
//     message: "Your data",
//   })
// );

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`) //reading nft data from mentioned address
);
//console.log(nfts)

app.get("/api/v1/nfts", (req, res) => {
  res.status(200).json({
    status: "success",
    results: nfts.length,
    data: {
      nfts: nfts,
    },
  });
});

app.post("/api/v1/nfts", (req, res) => {
  // console.log(req.body)

  const newId = nfts[nfts.length - 1].id + 1;
  const newNFTs = Object.assign({ id: newId }, req.body);
  nfts.push(newNFTs);
  //writing to the file
  fs.writeFile(
    `${__dirname}/nft-data/data/nft-simple.json`,
    JSON.stringify(nfts),
    (err) => {
      res.status(201).json({
        status: "success",
        nft: newNFTs,
      });
    }
  );
});

//Get single nft
app.get("/api/v1/nfts/:id", (req, res) => {
  const id = req.params.id * 1; //multiply with 1 to make the string id

  const nft = nfts.find((e) => e.id === id);

  //validator
  if (!nft) {
    return res.status(404).json({
      status: "failure",
      message: "Invalid ID!",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      nft: nft,
    },
  });
});

app.listen(port, () => console.log(`App running on port ${port}...`));
