import { useEffect, useState } from 'react';

export const getReportsBarChartData = () => {
    const [count, setCount] = useState(0);
    const [placedCount, setPlacedCount] = useState(0);
    const [unplacedCount, setUnplacedCount] = useState(0);
    const [companyCount, setCompanyCount] = useState(0);
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3001/api/students/count')
            .then(response => response.json())
            .then(data => {
                setCount(data.count);
                setPlacedCount(data.placedCount);
                setUnplacedCount(data.unplacedCount);
            })
            .catch(error => console.error(error));
        fetch('http://localhost:3001/api/companies/count')
            .then(response => response.json())
            .then(data => {
                setCompanyCount(data.c_count);
            })
            .catch(error => console.error(error));
        fetch('http://localhost:3001/api/pyears')
            .then(response => response.json())
            .then(data => {
                setLabels(data.labels); // Use "labels" property instead of "years"
                setData(data.data); // Use "data" property instead of "placed"
            })
            .catch(error => console.error(error));
    }, []);

    const chart = {
        labels:labels,
        datasets: { label: "Sales", data: data },
    };
    const items = [
        {
            icon: { color: "primary", component: "library_books" },
            label: "students",
            progress: { content: count.toString(), percentage: 100 },
        },
        {
            icon: { color: "info", component: "touch_app" },
            label: "companies",
            progress: { content: companyCount.toString(), percentage: 100 },
        },
        {
            icon: { color: "warning", component: "payment" },
            label: "placed",
            progress: { content: placedCount.toString(), percentage: parseInt((((placedCount) / count) * 100).toFixed(0)) },
        },
        {
            icon: { color: "error", component: "extension" },
            label: "remaining",
            progress: { content: unplacedCount.toString(), percentage: parseInt((((unplacedCount) / count) * 100).toFixed(0)) },
        },
    ];
    const secondLast = data[data.length - 2];
    const last = data[data.length - 1];
    const average1 = (((last - secondLast) / secondLast) * 100).toFixed(0);

    return { chart, items , average1 };
};
export default getReportsBarChartData;