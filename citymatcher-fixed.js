'use strict';

const fs = require('fs');
const cities = JSON.parse(fs.readFileSync('data.json')).cities;
const operations = JSON.parse(fs.readFileSync('operations.json')).operations;

const OP = {
  sum: (values) => values.reduce((a, b) => a + b),
  min: (values) => Math.min(...values),
  max: (values) => Math.max(...values),
  average: (values) => values.reduce((a, b) => a + b) / values.length,
};

const results = [];

operations.forEach((operation) => {
  const filteredCities = cities.filter((city) => {
    const attr =
      operation.type === 'attrib'
        ? city[operation.attrib]
        : city.values?.filter(
            (nestedObj) => nestedObj.name === operation.attrib
          )[0]?.value;
    city._attr = attr;
    return new RegExp(operation.filter).test(city.name) && attr !== undefined;
  });
  const result = OP[operation.func](filteredCities.map((city) => city._attr));

  results.push({
    name: operation.name,
    value: Math.round(result * 100) / 100,
  });
});

const data = JSON.stringify({ results: results }, null, 2);

fs.writeFileSync(
  'output.json',
  data.replaceAll(/\w\d+(\.?\d+)?\w/g, (n) => parseFloat(n).toFixed(2))
);
