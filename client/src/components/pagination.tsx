import { useEffect, useState } from "react";
import type { PaginationData } from "../types";

type PaginationProps = {
  paginationData: PaginationData
  setPaginationData: React.Dispatch<
    React.SetStateAction<PaginationData>>
}

const Pagination: React.FC<PaginationProps> = ({ paginationData, setPaginationData }) => {
  const [pages, setPages] = useState<number[]>([]);
  const { rowCount, ordersPerPage, currentPage } = paginationData;

  // Initialize pages array, then monitor changes in ordersPerPage
  useEffect(() => {
    const pagesNum: number[] = [...Array(Math.ceil(rowCount / ordersPerPage)).keys()].map(x => ++x);
    setPages(pagesNum);
  },[paginationData.ordersPerPage, rowCount])

  const handleClick = (operation: string) => {
    switch(operation) {
      case "++":
        if (paginationData.currentPage >= pages[pages.length-1]) break;
        setPaginationData({...paginationData, currentPage: currentPage + 1});
        break;
      case "--":
        if (currentPage === 1) break;
        setPaginationData({...paginationData, currentPage: currentPage - 1});
        break;
      case ">>":
        setPaginationData({...paginationData, currentPage: pages[pages.length-1]});
        break;
      case "<<":
        setPaginationData({...paginationData, currentPage: 1});
        break;
      default:
        break;
    }
  }

  return (<nav aria-label="Page navigation">
  <ul className="inline-flex -space-x-px text-sm">
    <li>
      <a onClick={() => handleClick("<<")} className="rounded-s-lg">{"<< First"}</a>
    </li>
    <li>
      <a onClick={() => handleClick("--")}>{"< Previous"}</a>
    </li>
    <li>
      <a>{currentPage}</a>
    </li>
    <li>
      <a onClick={() => handleClick("++")}>{"Next >"}</a>
    </li>
    <li>
      <a onClick={() => handleClick(">>")} className=" rounded-e-lg ">{`Last ${pages[pages.length-1] ? pages[pages.length-1].toString() : "" } >>`}</a>
    </li>
  </ul>
</nav>)
}
export default Pagination;