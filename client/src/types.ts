
export type Order = {
  id: string;
  kod: string;
  datVyst: string;
  kontaktJmeno: string;
  mesto: string;
  stat: string;
  ["stat@showAs"]: string; // 
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
