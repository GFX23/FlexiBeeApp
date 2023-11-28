import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { fullTextSearch } from './helpers';


const app = express();  
const PORT = 3001;

app.use(express.json(), cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
} );

// COLS TO FETCH FROM ABRAFLEXI
const detail = ["uzivatel","kod","datVyst","kontaktJmeno","mesto","stat","ulice","psc","ic","dic","formaDopravy","formaUhradyCis","zamekK","nazFirmy","sumCelkem","polozkyObchDokladu(kod,nazev)","mena"]

// MAIN URL
const url = 'https://demo.flexibee.eu/c/demo/';

// FETCH FAKTURY API
app.post('/fetch-invoiceData', async (req, res) => {
  let filter = req.body.filter;
  let payload = {filter:`(cisObj eq "${filter}") and typDokl eq "code:FAKTURA"`, detail: "custom:cisObj,typDokl", }
  
  try {
    const invoiceResponse = await axios.post(
      `${url}faktura-vydana/query.json`,{
      winstrom: payload
    });

    // CHECK IF INVOICE EXISTS
    if (invoiceResponse.data.winstrom["faktura-vydana"].length === 0) {
      console.log("Faktura nenalezena");
      return res.status(404).send('Faktura nenalezena');
    } else {
      console.log("Nalezeno: ",invoiceResponse.data.winstrom["faktura-vydana"].length, " faktura/faktur");
    }
    
    // SEND DATA
    return res.json(invoiceResponse.data.winstrom["faktura-vydana"]);

  } catch (error) {
    res.status(500).send('Chyba při získávání dat z Flexibee');
    console.error("Chyba při získávání dat: ",error);
  }
})

// FETCH ORDER API
app.post('/fetch-orderData', async (req, res) => {
  let { limit, currentPage } = req.body;

    // HOW MUCH ORDER SHOULD WE SKIP
  let skip = (currentPage - 1) * limit;
  try {
    const orderResponse = await axios.post(`${url}objednavka-prijata/query.json`, {
    winstrom: { detail: `custom:${detail.join(",")}`, "limit":limit, "start":skip, "add-row-count":"true",
    }});

    // SEND DATA
    res.json({rowCount: orderResponse.data.winstrom["@rowCount"], orders: orderResponse.data.winstrom["objednavka-prijata"]});
    console.log(`Found ${orderResponse.data.winstrom["@rowCount"]} orders. Displayed ${limit} orders`);
  } catch (error) {
    res.status(500).send('Chyba při získávání dat z Flexibee');
    console.log(error);
  }
});

// FETCH FILTERED ORDER API
app.post('/fetch-filteredData', async (req, res) => {
  let { filter, limit, currentPage } = req.body;

  // HOW MUCH ORDER SHOULD WE SKIP
  let skip = (currentPage - 1) * limit;
  try {
    const orderResponse = await axios.post(`${url}objednavka-prijata/query.json`, {
    winstrom: { detail: `custom:${detail.join(",")}`, "limit":"0", "add-row-count":"true",
    }});

    // FILTER DATA
    const data = orderResponse.data.winstrom["objednavka-prijata"]
    const filteredData = fullTextSearch(data, filter)

    // SEND DATA
    res.json({rowCount: filteredData.length, orders: filteredData.slice(skip, skip + limit)});
    console.log(`Found ${orderResponse.data.winstrom["@rowCount"]} orders. Displayed ${limit} orders`);
  } catch (error) {
    res.status(500).send('Chyba při získávání dat z Flexibee');
    console.log(error);
  }
});

