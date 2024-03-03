// Define the URL to fetch data from
var url = '/api/v1.0/civil_court_data';

// Fetch data and populate dropdown
d3.json(url).then(data => {
    console.log('Data fetched:', data); // Log fetched data
    var yearSelect = document.getElementById('yearSelect');
    var years = Array.from(new Set(data.map(entry => entry.Year_Period))); // Get unique years
    console.log('Unique years:', years); // Log unique years
    var firstYear = "";
    years.forEach(year => {
        var option = document.createElement('option');
        option.value = year;
        if (firstYear.length < 1)
            {firstYear = year;}
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    // Attach event listener to dropdown
    yearSelect.addEventListener('change', function() {
        var selectedYear = this.value;
        console.log('Selected year:', selectedYear); // Log selected year
        // Call function to fetch data for selected year
        fetchDataForYear(selectedYear);
    });
    fetchDataForYear(firstYear);
})
.catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error fetching data:', error);
});

// Function to fetch data for a specific year
function fetchDataForYear(year) {
    // Construct the URL with the query parameter for the selected year
    var urlForYear = `/api/v1.0/civil_court_data?year=${year}`;
    console.log('Fetching data for year:', year); // Log fetching data for selected year
    // Fetch data from the API
    d3.json(urlForYear)
        .then(yeardata => {
            console.log('Data fetched for year', year, ':', yeardata); // Log fetched data for selected year
            // Call the function to generate the charts with the fetched data
            generateCharts(yeardata, year);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('Error fetching data for year', year, ':', error);
        });
}

// Function to generate charts
function generateCharts(data, year) {
    if (!data || data.length === 0) {
        console.error('No data available for year', year);
               return;
    }
     // Clear existing charts
     Plotly.purge('jurisdictionChart');
     Plotly.purge('caseTypeChart');
     Plotly.purge('jurisdictionsPieChart');

    // Group data by jurisdiction and case type
    var jurisdictionData = {};
    var caseTypeData = {};

    data.forEach(entry => {
        jurisdictionData[entry.Jurisdiction] = (jurisdictionData[entry.Jurisdiction] || 0) + entry.Case_Count;
        caseTypeData[entry.Case_Type] = (caseTypeData[entry.Case_Type] || 0) + entry.Case_Count;
    });

    // Get labels and data for jurisdictions pie chart
    var jurisdictionLabels = Object.keys(jurisdictionData);
    var jurisdictionValues = Object.values(jurisdictionData);

    // Get labels and data for case type chart
    var caseTypeLabels = Object.keys(caseTypeData);
    var caseTypeValues = Object.values(caseTypeData);

    // Create Jurisdiction chart
    var jurisdictionChartData = [{
        x: jurisdictionLabels,
        y: jurisdictionValues,
        type: 'bar',
        name: 'Number of Cases'
    }];
    Plotly.newPlot('jurisdictionChart', jurisdictionChartData, {title: `Number of Civil Cases by Jurisdiction (${year})`});

    // Create Case Type chart
    var caseTypeChartData = [{
        x: caseTypeLabels,
        y: caseTypeValues,
        type: 'bar',
        name: 'Number of Cases'
    }];
    Plotly.newPlot('caseTypeChart', caseTypeChartData, {title: `Number of Civil Cases by Case Type (${year})`});

    // Create Pie chart for jurisdictions
    var jurisdictionsPieChartData = [{
        labels: jurisdictionLabels,
        values: jurisdictionValues,
        type: 'pie'
    }];
    Plotly.newPlot('jurisdictionsPieChart', jurisdictionsPieChartData, {title: `Civil Cases Distribution by Jurisdiction (${year})`});
}
