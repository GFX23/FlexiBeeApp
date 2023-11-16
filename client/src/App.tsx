import { useState } from "react";
import { Order } from "./types";

const App: React.FC = () => {
  const [data, setData] = useState<Order[] | null>(null);

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:3001/fetch-flexibee-orderData"
    );
    const data = await response.json();
    console.log(data);
    setData(data);
  };

  const verifyData = (data: string) => (data === "" || data === undefined) ? "----" : data;

  const orderHeaders: string[] = [
    "KÓD",
    "VYSTAVENO",
    "KONTAKT",
    "MĚSTO",
    "STÁT",
    "ULICE",
    "PSČ",
    "IČO",
    "DIČ",
    "DOPRAVA",
    "FORMA ÚHRADY",
    "FIRMA",
    "SUMA CELKEM",
    "POLOZKY",
    "FAKTURA"
  ];

  return (
    <div className="App">
      <h3 className="text-5xl">FlexiBee App - Správa objednávek</h3>
      <button onClick={() => fetchData()}>Fetch data</button>
      <table className="table-auto border-collapse border border-slate-400 ">
        <thead>
          <tr>
            {orderHeaders.map((header) => (
              <th className="border border-slate-500 bg-slate-100">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            ? data?.map((order: Order) => (
                <tr>
                  <td>{order.kod}</td>
                  <td>{order.datVyst.substring(0,10)}</td>
                  <td>{verifyData(order.kontaktJmeno)}</td>
                  <td>{verifyData(order.mesto)}</td>
                  <td>{verifyData(order["stat@showAs"])}</td>
                  <td>{verifyData(order.ulice)}</td>
                  <td>{verifyData(order.psc)}</td>
                  <td>{verifyData(order.ic)}</td>
                  <td>{verifyData(order.dic)}</td>
                  <td>{verifyData(order.formaDopravy)}</td>
                  <td>{verifyData(order.formaUhradyCis.replace("code:", ""))}</td>
                  <td>{verifyData(order.nazFirmy)}</td>
                  <td>{verifyData(order.sumCelkem)} {order.mena.replace("code:", "")}</td>
                  <td className="flex flex-row">
                    {order.polozkyObchDokladu?.map((polozka) => (
                      <p>{polozka.nazev}</p>
                    ))}
                  </td>
                  <td>
                    <a href={order.faktura} target="_blank">
                      {order.faktura}
                    </a>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
};
export default App;
