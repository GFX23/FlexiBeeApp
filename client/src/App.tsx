import { useState, useEffect } from "react";
import { Order, PaginationData } from "./types";
import Pagination from "./components/pagination";
import axios from "axios";
import {
  handlerFetchInvoiceData,
  orderHeaders,
  verifyData,
} from "./utils/helperFunctions";

const App: React.FC = () => {
  const [data, setData] = useState<Order[] | null>(null);
  const [input, setInput] = useState<string>("");
  const [paginationData, setPaginationData] = useState<PaginationData>({
    rowCount: 0,
    ordersPerPage: 10,
    currentPage: 1,
    filter: "",
  });

  console.log("input", input);
  console.log("filter", paginationData.filter);

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await axios.post(
        "http://localhost:3001/fetch-orderData",
        {
          limit: paginationData.ordersPerPage,
          currentPage: paginationData.currentPage,
          filter: paginationData.filter,
        }
      );
      const data = await response.data;
      setData(data["objednavka-prijata"]);
      console.log(data)
      console.log(data["@rowCount"])
      setPaginationData({ ...paginationData, rowCount: parseInt(data["@rowCount"]) });
    };
    fetchOrderData();
  }, [paginationData.currentPage, paginationData.ordersPerPage]);

  return (
    <div className="App">
      <h3 className="text-4xl bg-slate-200 p-2">
        FlexiBee App - Správa objednávek
      </h3>
      <div className="p-2 gap-4 flex flex-row items-center border-y-2">
        <p>Stránkování:</p>
        <Pagination
          paginationData={paginationData}
          setPaginationData={setPaginationData}
        />
        <p>Počet na stránce:</p>
        <select
          onChange={(e) =>
            setPaginationData({
              ...paginationData,
              ordersPerPage: parseInt(e.target.value),
            })
          }
        >
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        {/** FILTER FUNCTION */}
        <p>Filter:</p>
        <input onChange={(e) => setInput(e.target.value)} type="text" />
        <button
          onClick={() =>
            setPaginationData({ ...paginationData, filter: input })
          }
        >
          Hledej
        </button>
      </div>

      {/** TABLE */}
      <table className="table-auto text-xs border-collapse border border-slate-400 mt-2 ">
        <thead>
          <tr>
            {/** HEADERS */}
            {orderHeaders.map((header) => (
              <th className={`border border-slate-500 bg-slate-100`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/** BODY */}
          {data
            ? data?.map((order: Order) => (
                <tr>
                  <td>{order.kod}</td>
                  <td>{order.datVyst.substring(0, 10)}</td>
                  <td>{order["uzivatel@showAs"]}</td>
                  <td>{order["zamekK@showAs"]}</td>
                  <td>{verifyData(order.kontaktJmeno)}</td>
                  <td>{verifyData(order.mesto)}</td>
                  <td>{verifyData(order["stat@showAs"])}</td>
                  <td>{verifyData(order.ulice)}</td>
                  <td>{verifyData(order.psc)}</td>
                  <td>{verifyData(order.ic)}</td>
                  <td>{verifyData(order.dic)}</td>
                  <td>{verifyData(order.formaDopravy.replace("code:", ""))}</td>
                  <td>
                    {verifyData(order.formaUhradyCis.replace("code:", ""))}
                  </td>
                  <td>{verifyData(order.nazFirmy)}</td>
                  <td>
                    {verifyData(order.sumCelkem)}{" "}
                    {order.mena.replace("code:", "")}
                  </td>
                  <td>
                    <select className="w-full">
                      {/** ITEMS */}
                      {order.polozkyObchDokladu?.map((polozka) => (
                        <option className="">
                          {polozka.nazev ? polozka.nazev : "Nejsou" /**/}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {/** INVOICE */}
                    <button onClick={() => handlerFetchInvoiceData(order.kod)}>
                      FAKTURA
                    </button>
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
