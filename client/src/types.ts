
export type Order = {
  id: string;
  kod: string;
  datVyst: string;
  kontaktJmeno: string;
  mesto: string;
  stat: string;
  ["stat@showAs"]: string; // 
  ["zamekK@showAs"]: string; //
  ["uzivatel@showAs"]: string; //
  ulice: string;
  psc: string;
  ic: string;
  dic: string;
  formaDopravy: string;
  formaUhradyCis: string;
  nazFirmy: string;
  sumCelkem: string;
  polozkyObchDokladu: PolozkyObchDokladu[];
  mena: string
  faktura: string;
};

export type PolozkyObchDokladu = {
  kod: string;
  nazev: string;
};

export type Invoice = {
  id: string;
  cisObj: string;
}

export type PaginationData = {
  rowCount: number;
  ordersPerPage: number;
  currentPage: number;
  filter: string;
}
