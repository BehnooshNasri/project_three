// Define the URL to fetch data from
const url = '/api/v1.0/civil_court_data';

// Fetch data and populate dropdown
d3.json(url).then(data => {
   const yearSelect = document.getElementById('yearSelect');
   const years = Array.from(new Set(data.map(entry => entry.Year_Period))); // Get unique years
   years.forEach(year => {
       const option = document.createElement('option');
       option.value = year;
       option.textContent = year;
       yearSelect.appendChild(option);
   });
   // Attach event listener to dropdown
   yearSelect.addEventListener('change', function() {
       const selectedYear = this.value;
       // Call function to fetch data for selected year
       fetchDataForYear(selectedYear);
   });
});

// Function to fetch data for a specific year
function fetchDataForYear(year) {
   // Construct the URL with the query parameter for the selected year
   const urlForYear = `/api/v1.0/civil_court_data?Year_Period=${year}`;

   // Fetch data from the API
   d3.json(urlForYear)
      .then(data => {
          // Call the function to generate the chart with the fetched data
          generateFullChart(data);
      })
      .catch(error => {
          // Handle any errors that occur during the fetch
          console.error('Error fetching data:', error);
      });
}

// Fetch data and generate chart
d3.json(url).then(generateFullChart);  
    
// Function to generate charts
function generateFullChart(data) {
   if (!data || data.length === 0) {
       console.error('No data available.');
       return;
   }

   // Group data by jurisdiction
   const jurisdictionData = data.reduce((acc, entry) => {
       if (!acc[entry.Jurisdiction]) {
           acc[entry.Jurisdiction] = 0;
       }
       acc[entry.Jurisdiction] += entry.Case_Count;
       return acc;
   }, {});

   // Group data by case type
   const caseTypeData = data.reduce((acc, entry) => {
       if (!acc[entry.Case_Type]) {
           acc[entry.Case_Type] = 0;
       }
       acc[entry.Case_Type] += entry.Case_Count;
       return acc;
   }, {});

   // Get labels and data for jurisdictions pie chart
   const jurisdictionLabels = Object.keys(jurisdictionData);
   const jurisdictionValues = Object.values(jurisdictionData);

   // Create Jurisdiction chart
   const jurisdictionChart = new Chart(document.getElementById('jurisdictionChart'), {
       type: 'bar',
       data: {
           labels: jurisdictionLabels,
           datasets: [{
               label: 'Number of Cases',
               data: jurisdictionValues,
               backgroundColor: 'rgba(54, 162, 235, 0.5)',
               borderColor: 'rgba(54, 162, 235, 1)',
               borderWidth: 1
           }]
       },
       options: {
           scales: {
               y: {
                   beginAtZero: true
               }
           }
       }
   });

   // Get labels and data for case type chart
   const caseTypeLabels = Object.keys(caseTypeData);
   const caseTypeValues = Object.values(caseTypeData);

   // Create Case Type chart
   const caseTypeChart = new Chart(document.getElementById('caseTypeChart'), {
       type: 'bar',
       data: {
           labels: caseTypeLabels,
           datasets: [{
               label: 'Number of Cases',
               data: caseTypeValues,
               backgroundColor: 'rgba(255, 99, 132, 0.5)',
               borderColor: 'rgba(255, 99, 132, 1)',
               borderWidth: 1
           }]
       },
       options: {
           scales: {
               y: {
                   beginAtZero: true
               }
           }
       }
   });

   // Create Pie chart for jurisdictions
   const jurisdictionsPieChart = new Chart(document.getElementById('jurisdictionsPieChart'), {
       type: 'pie',
       data: {
           labels: jurisdictionLabels,
           datasets: [{
               label: 'Number of Cases',
               data: jurisdictionValues,
               backgroundColor: [
                   'rgba(255, 99, 132, 0.5)',
                   'rgba(54, 162, 235, 0.5)',
                   'rgba(255, 206, 86, 0.5)',
                   'rgba(75, 192, 192, 0.5)',
                   'rgba(153, 102, 255, 0.5)',
                   'rgba(255, 159, 64, 0.5)'
               ],
               hoverOffset: 4
           }]
       }
   });
}