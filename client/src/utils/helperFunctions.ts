import type { Invoice } from "../types";
import axios from "axios";

export const handlerFetchInvoiceData = async (cisObj: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/fetch-invoiceData",
      {
        filter: cisObj,
      }
    );
    const data = await response.data;
    console.log(data);
    data.forEach((invoice: Invoice) =>
      window.open(`https://demo.flexibee.eu/c/demo/faktura-vydana/${invoice.id}.pdf`,
        "_blank"),);
      } catch (error: any) {
        if (error.response.status === 404) return alert("Faktura nenalezena!");
        console.error("Error fetching invoice ID: ", error);
  }
};

export const verifyData = (data: string) =>
  data === "" || data === undefined || data === "null" ? "----" : data;

export const orderHeaders: string[] = [
  "KÓD",
  "VYSTAVENO",
  "UŽIVATEL",
  "STAV",
  "KONTAKT",
  "MĚSTO",
  "STÁT",
  "ULICE",
  "PSČ",
  "IČO",
  "DIČ",
  "DOPRAVA",
  "PLATBA",
  "FIRMA",
  "SUMA CELKEM",
  "POLOZKY",
  "FAKTURA",
];
