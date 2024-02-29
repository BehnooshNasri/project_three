// Define the URL to fetch data from
const url = '/api/v1.0/civil_court_data';

// Fetch data from the API and populate the dropdown
d3.json(url).then(generateFullChart)  
    
function generateFullChart(response) {
   year = response.Year_Period
   jurisdiction = response.Jurisdiction
   case_type = response.Case_Type
   case_count = response.Case_Count

   let trace1 = {
      x: jurisdiction,
      y: case_count,
      text: "jurisdiction",
      name: "Jurisdiction",
      type: "bar"
   }

   let trace2 = {
      x: case_type,
      y: case_count,
      text: "case_type",
      name: "Case Type",
      type: "bar"
   }

   let data = [trace1, trace2]

   let layout = {
      title: "Number of Civil Cases by Jurisdiction and Case Type from 2005 to 2022",
      barmode: "group",
      margin: {
         l: 50,
         r: 50,
         b: 200,
         t: 50,
         pad: 4
       }
   }

   Plotly.newPlot("plot", data, layout)
};


d3.json(url).then(generateCaseTypeChart)

function generateCaseTypeChart(response) {

   
};


d3.json(url).then(generateJurisdictionChart)

function generateJurisdictionChart(response) {

   
};