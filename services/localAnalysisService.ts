
import type { DashboardData, KPIData, ChartInfo } from '../types';
import { TableRowsIcon, ColumnsIcon, AlertTriangleIcon } from '../components/IconComponents';

const parseCSV = (csvContent: string): { headers: string[], rows: string[][] } => {
  const lines = csvContent.trim().split('\n').map(line => line.trim());
  if (lines.length < 1) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1)
    .filter(line => line)
    .map(line => line.split(',').map(cell => cell.trim()));
  return { headers, rows };
};

const isNumeric = (val: string): boolean => {
    if (val === null || val.trim() === '') return false;
    return !isNaN(Number(val));
}

const CHART_COLORS = [
    '#4f46e5', '#f97316', '#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#ef4444'
];

export const analyzeCsvForDashboard = async (csvContent: string): Promise<DashboardData> => {
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const { headers, rows } = parseCSV(csvContent);
    const rowCount = rows.length;
    const colCount = headers.length;

    if (rowCount === 0 || colCount === 0) {
        throw new Error("CSV file is empty or improperly formatted.");
    }

    // 1. Calculate KPIs
    let missingValuesCount = 0;
    rows.forEach(row => {
        row.forEach(cell => {
            if (cell === null || cell.trim() === '') {
                missingValuesCount++;
            }
        });
    });

    const kpis: KPIData[] = [
        { title: 'Total Rows', value: rowCount.toLocaleString(), icon: TableRowsIcon },
        { title: 'Total Columns', value: colCount.toLocaleString(), icon: ColumnsIcon },
        { title: 'Missing Values', value: missingValuesCount.toLocaleString(), icon: AlertTriangleIcon },
    ];

    // 2. Generate Chart Data
    const charts: ChartInfo[] = [];
    headers.forEach((header, colIndex) => {
        const columnData = rows.map(row => row[colIndex]).filter(val => val !== null && val.trim() !== '');
        if (columnData.length === 0) return;

        const isAllNumeric = columnData.every(isNumeric);

        if (isAllNumeric) {
            // Create a histogram for numeric data
            const numericData = columnData.map(Number);
            const max = Math.max(...numericData);
            const min = Math.min(...numericData);
            const binCount = Math.min(10, Math.ceil(Math.sqrt(numericData.length)));
            const binSize = (max - min) / binCount;
            
            const bins: { [key: string]: number } = {};
            const labels: string[] = [];

            for(let i=0; i < binCount; i++) {
                const binStart = min + i * binSize;
                const binEnd = binStart + binSize;
                const label = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
                labels.push(label);
                bins[label] = 0;
            }
            if (binSize > 0) {
                 numericData.forEach(value => {
                    const binIndex = Math.min(Math.floor((value - min) / binSize), binCount -1);
                    const label = labels[binIndex];
                    if (label) bins[label]++;
                });
            } else {
                // All values are the same
                if(labels.length > 0) bins[labels[0]] = numericData.length;
            }

            charts.push({
                title: `${header} (Distribution)`,
                type: 'bar',
                data: {
                    labels: Object.keys(bins),
                    datasets: [{
                        label: header,
                        data: Object.values(bins),
                        backgroundColor: '#3b82f6',
                        borderColor: '#1e40af',
                        borderWidth: 1
                    }]
                }
            });
        } else {
            // Create a bar chart for categorical data
            const valueCounts: { [key: string]: number } = {};
            columnData.forEach(val => {
                valueCounts[val] = (valueCounts[val] || 0) + 1;
            });

            const uniqueValues = Object.keys(valueCounts);

            // Heuristic to avoid charting high-cardinality columns (e.g., IDs, names)
            if (uniqueValues.length > 25 && (uniqueValues.length / rowCount > 0.8)) {
                return; // Skip this column as it's likely an identifier
            }
            
            const chartType = uniqueValues.length <= 6 ? 'pie' : 'bar';
            
            // For bar charts, sort for better readability and limit to top 15
            const sortedData = Object.entries(valueCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 15);

            charts.push({
                title: `${header} (Counts)`,
                type: chartType,
                data: {
                    labels: sortedData.map(([label]) => label),
                    datasets: [{
                        label: header,
                        data: sortedData.map(([, count]) => count),
                        backgroundColor: chartType === 'pie' ? CHART_COLORS : '#4f46e5',
                    }]
                }
            });
        }
    });

    // 3. Prepare Table Data
    const tableData = { headers, rows };

    return { kpis, charts, tableData };
};