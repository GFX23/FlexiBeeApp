import { useState, useEffect } from "react";
import { Order, PaginationData, PolozkyObchDokladu } from "./types";
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


  // FETCH DATA FROM SERVER - URL BASED ON FILTER
  useEffect(() => {
    const fetchOrderData = async () => {
      let url =
        paginationData.filter === ""
          ? "http://localhost:3001/fetch-orderData"
          : "http://localhost:3001/fetch-filteredData";
      const response = await axios.post(url, {
        limit: paginationData.ordersPerPage,
        currentPage: paginationData.currentPage,
        filter: paginationData.filter,
      });
      const data = await response.data;
      setData(data.orders);
      setPaginationData({
        ...paginationData,
        rowCount: data["@rowCount"]
          ? parseInt(data["@rowCount"])
          : data.rowCount,
      });
    };
    fetchOrderData();
  }, [
    paginationData.currentPage,
    paginationData.ordersPerPage,
    paginationData.filter,
  ]);

  // RENDER ORDER ITEMS
  const renderItems = (polozky: PolozkyObchDokladu[]) => {
    if (polozky === undefined || polozky.length === 0)
      return <option>-----------------</option>;
    return polozky.map((polozka, index) => (
      <option key={index} className="">
        {polozka.nazev}
      </option>
    ));
  };

  // HANDLER FOR NUMBER OF ITEMS ON PAGE CHANGE
  const handleScreenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentPos: number =
      (paginationData.currentPage - 1) * paginationData.ordersPerPage;
    setPaginationData({
      ...paginationData,
      ordersPerPage: parseInt(e.target.value),
      currentPage: Math.ceil((currentPos + 1) / parseInt(e.target.value)),
    });
  };

  const handleRemoveFilter = () => {
    setPaginationData({ ...paginationData, filter: "" });
    setInput("");
  };

  // CALCULATE CURRENTLY VIEWED ORDERS
  const viewedOrders =
    paginationData.ordersPerPage * (paginationData.currentPage - 1);
  const lastViewedOrder = viewedOrders + paginationData.ordersPerPage;

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
        <select onChange={(e) => handleScreenChange(e)}>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        {/** FILTER FUNCTION */}
        <p>Filter:</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
        />
        <button
          onClick={() =>
            setPaginationData({
              ...paginationData,
              currentPage: 1,
              filter: input,
            })
          }
        >
          Hledej
        </button>
        {/** REMOVE FILTER */}
        <button onClick={() => handleRemoveFilter()}>
          {paginationData.filter} X
        </button>
      </div>

      {/** TABLE */}
      <table className="table-auto text-xs border-collapse border border-slate-400 mt-2 ">
        <thead>
          <tr>
            {/** HEADERS */}
            {orderHeaders.map((header, index) => (
              <th
                key={index}
                className={`border border-slate-500 bg-slate-100`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/** BODY */}
          {data
            ? data?.map((order: Order) => (
                <tr key={order.id}>
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
                      {renderItems(order.polozkyObchDokladu)}
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
      <p className="ml-2">{`Nalezeno ${
        paginationData.rowCount
      } položek. Zobrazeno ${viewedOrders + 1} - ${
        lastViewedOrder > paginationData.rowCount
          ? paginationData.rowCount
          : lastViewedOrder
      }`}</p>
    </div>
  );
};
export default App;
