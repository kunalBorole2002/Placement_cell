import { useEffect, useState } from 'react';

export const getGradientLineChartData = () => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/pyears')
        .then(response => response.json())
        .then(data => {
          setLabels(data.labels); // Use "labels" property instead of "years"
          setData(data.data); // Use "data" property instead of "placed"
        })
        .catch(error => console.error(error));
  }, []);

  const gradientLineChartData = {
    labels: labels,
    datasets: [
      {
        label: "Placed",
        color: "dark",
        data: data,
      },
    ],
  };
  const secondLast = data[data.length - 2];
  const last = data[data.length - 1];
  const average = (((last - secondLast) / secondLast) * 100).toFixed(0);

  const lastyear = labels[labels.length - 1];

  return {average, gradientLineChartData, lastyear};
};

export default getGradientLineChartData;
