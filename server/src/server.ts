import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();  
const PORT = 3001;

app.use(express.json(), cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
} );

app.post('/fetch-invoiceData', async (req, res) => {
  let filter = req.body.filter;
  let payload = {filter:`(cisObj eq "${filter}") and typDokl eq "code:FAKTURA"`, detail: "custom:cisObj,typDokl", }
  
  try {
    const invoiceResponse = await axios.post('https://demo.flexibee.eu/c/demo/faktura-vydana/query.json',{
      winstrom: payload
  });

    res.json(invoiceResponse.data);
    console.log(invoiceResponse.data);
  } catch (error) {
    res.status(500).send('Chyba při získávání dat z Flexibee');
    console.log(error);
  }
})

app.post('/fetch-orderData', async (req, res) => {
  let limit = req.body.limit;
  let page = req.body.currentPage;
  let skip = (page - 1) * limit;
  try {
    const orderResponse = await axios.post('https://demo.flexibee.eu/c/demo/objednavka-prijata/query.json?add-row-count=true', {
    winstrom: { detail: "custom:kod,datVyst,kontaktJmeno,mesto,stat,ulice,psc,ic,dic,formaDopravy,formaUhradyCis,nazFirmy,sumCelkem,polozkyObchDokladu(kod,nazev),mena", "limit":limit, "start":skip  }
    });

    res.json(orderResponse.data.winstrom);
    console.log(`Found ${orderResponse.data.winstrom["@rowCount"]} orders. Displayed ${limit} orders`);
  } catch (error) {
    res.status(500).send('Chyba při získávání dat z Flexibee');
    console.log(error);
  }
});

app.post('/fetch-flexibee-orderData', async (req, res) => {
  let limit = 100;
  let page = req.body.currentPage;
  let skip = (page - 1) * limit;
  console.log(limit)
  console.log(page)
  try {
    const invoiceResponse = await axios.post('https://demo.flexibee.eu/c/demo/objednavka-prijata/query.json?add-row-count=true', {
    winstrom: { detail: "custom:id,kod,polozkyObchDokladu(kod,nazev)", "limit":limit, "start":skip  }
    });

    res.json(invoiceResponse.data.winstrom);
    console.log(`Found ${invoiceResponse.data.winstrom["@rowCount"]} orders. Displayed ${limit} orders`);
  } catch (error) {
    res.status(500).send('Chyba při získávání dat z Flexibee');
    console.log(error);
  }
});