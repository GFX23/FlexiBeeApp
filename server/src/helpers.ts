export const extractStringValues = (obj: any): string[] => {
  let values: string[] = [];

  for (let key in obj) {
      if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any) => {
              values = values.concat(extractStringValues(item));
          });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          values = values.concat(extractStringValues(obj[key]));
      } else if (typeof obj[key] === 'string') {
          values.push(obj[key]);
      }
  }

  return values;
}

export const fullTextSearch = (objects: any[], searchTerm: string): any[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return objects.filter(obj => {
      const stringValues = extractStringValues(obj);
      return stringValues.some(value => value.toLowerCase().includes(lowerCaseSearchTerm));
  });
}