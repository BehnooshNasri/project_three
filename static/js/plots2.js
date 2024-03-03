// Define the URL to fetch data from
var url = '/api/v1.0/civil_court_data';

// Fetch data and populate dropdown
d3.json(url).then(data => {
    console.log('Data fetched:', data); // Log fetched data
    var placeSelect = document.getElementById('placeSelect');
    var places = Array.from(new Set(data.map(entry => entry.Jurisdiction))); // Get unique jurisdictions
    console.log('Unique places:', places); // Log unique places
    var firstPlace = "";
    places.forEach(place => {
        var option = document.createElement('option');
        option.value = place;
        if (firstPlace.length < 1)
            {firstPlcae = place;}
        option.textContent = place;
        placeSelect.appendChild(option);
    });
    // Attach event listener to dropdown
    placeSelect.addEventListener('change', function() {
        var selectedPlace = this.value;
        console.log('Selected place:', selectedPlace); // Log selected jurisdiction
        // Call function to fetch data for selected jurisdiction
        fetchDataForPlace(selectedPlace);
    });
    fetchDataForPlace(firstPlace);
})
.catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error fetching data:', error);
});

// Function to fetch data for a specific jurisdiction
function fetchDataForPlace(place) {
    // Construct the URL with the query parameter for the selected jurisdiction
    var urlForPlace = `/api/v1.0/civil_court_data?place=${place}`;
    console.log('Fetching data for place:', place); // Log fetching data for selected jurisdiction
    // Fetch data from the API
    d3.json(urlForPlace)
        .then(placedata => {
            console.log('Data fetched for place', place, ':', placedata); // Log fetched data for selected jurisdcition
            // Call the function to generate the charts with the fetched data
            generateJurisdictionChart(placedata, place);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.error('Error fetching data for jurisdiction', place, ':', error);
        });
}

// Function to generate charts
function generateJurisdictionChart(data, place) {
    if (!data || data.length === 0) {
        console.error('No data available for place', place);
               return;
    }
     // Clear existing chart
     Plotly.purge('jurisdictionChart');
  

    // Group data by year and case type
    var yearData = {};
    var caseTypeData = {};

    data.forEach(entry => {
        yearData[entry.Year_Period] = (yearData[entry.Year_Period] || 0) + entry.Case_Count;
        caseTypeData[entry.Case_Type] = (caseTypeData[entry.Case_Type] || 0) + entry.Case_Count;
    });

    // Get labels and data for jurisdictions pie chart
    var yearLabels = Object.keys(yearData);
    var yearValues = Object.values(yearData);

    // // Get labels and data for case type chart
    // var caseTypeLabels = Object.keys(caseTypeData);
    // var caseTypeValues = Object.values(caseTypeData);

    // Create Jurisdiction chart
    var jurisdictionChartData = [{
        x: yearLabels,
        y: yearValues,
        type: 'bar',
        name: 'Number of Cases'
    }];
    Plotly.newPlot('jurisdictionChart', jurisdictionChartData, {title: `Number of Civil Cases by Jurisdiction (${place})`});

}
