// Define the URL to fetch data from
const url = '/api/v1.0/civil_court_data';

// Fetch data and populate dropdown
d3.json(url).then(data => {
    console.log('Data fetched:', data); // Log fetched data
    const yearSelect = document.getElementById('yearSelect');
    const years = Array.from(new Set(data.map(entry => entry.Year_Period))); // Get unique years
    console.log('Unique years:', years); // Log unique years
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    // Attach event listener to dropdown
    yearSelect.addEventListener('change', function() {
        const selectedYear = this.value;
        console.log('Selected year:', selectedYear); // Log selected year
        // Call function to fetch data for selected year
        fetchDataForYear(selectedYear);
    });
})
.catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error fetching data:', error);
});

// Function to fetch data for a specific year
function fetchDataForYear(year) {
    // Construct the URL with the query parameter for the selected year
    const urlForYear = `/api/v1.0/civil_court_data?Year_Period=${year}`;
    console.log('Fetching data for year:', year); // Log fetching data for selected year
    // Fetch data from the API
    d3.json(urlForYear)
        .then(data => {
            console.log('Data fetched for year', year, ':', data); // Log fetched data for selected year
            // Call the function to generate the charts with the fetched data
            generateCharts(data);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('Error fetching data for year', year, ':', error);
        });
}

// Function to generate charts
function generateCharts(data) {
    if (!data || data.length === 0) {
        console.error('No data available.');
        return;
    }

    // Group data by jurisdiction and case type
    const jurisdictionData = {};
    const caseTypeData = {};
    data.forEach(entry => {
        jurisdictionData[entry.Jurisdiction] = (jurisdictionData[entry.Jurisdiction] || 0) + entry.Case_Count;
        caseTypeData[entry.Case_Type] = (caseTypeData[entry.Case_Type] || 0) + entry.Case_Count;
    });

    // Get labels and data for jurisdictions pie chart
    const jurisdictionLabels = Object.keys(jurisdictionData);
    const jurisdictionValues = Object.values(jurisdictionData);

    // Get labels and data for case type chart
    const caseTypeLabels = Object.keys(caseTypeData);
    const caseTypeValues = Object.values(caseTypeData);

    // Create Jurisdiction chart
    const jurisdictionChartData = [{
        x: jurisdictionLabels,
        y: jurisdictionValues,
        type: 'bar',
        name: 'Number of Cases'
    }];
    Plotly.newPlot('jurisdictionChart', jurisdictionChartData, {title: 'Number of Civil Cases by Jurisdiction'});

    // Create Case Type chart
    const caseTypeChartData = [{
        x: caseTypeLabels,
        y: caseTypeValues,
        type: 'bar',
        name: 'Number of Cases'
    }];
    Plotly.newPlot('caseTypeChart', caseTypeChartData, {title: 'Number of Civil Cases by Case Type'});

    // Create Pie chart for jurisdictions
    const jurisdictionsPieChartData = [{
        labels: jurisdictionLabels,
        values: jurisdictionValues,
        type: 'pie'
    }];
    Plotly.newPlot('jurisdictionsPieChart', jurisdictionsPieChartData, {title: 'Civil Cases Distribution by Jurisdiction'});
}