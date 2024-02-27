// Fetch data from Flask route
fetch('/api/v1.0/civil_court_data')
    .then(response => response.json())
    .then(data => {
        createGroupedBarChart(data);
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to create the grouped bar chart
function createGroupedBarChart(data) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600;
    const height = 400;

    // Create SVG element
    const svg = d3.select('#plot')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    // Extract unique jurisdictions and case types
    const jurisdictions = [...new Set(data.map(d => d.Jurisdiction))];
    const caseTypes = [...new Set(data.map(d => d.Case_Type))];

    // Create scales for x and y axes
    const x0 = d3.scaleBand()
                 .domain(data.map(d => d.Year_Period))
                 .rangeRound([margin.left, width - margin.right])
                 .paddingInner(0.1);

    const x1 = d3.scaleBand()
                 .domain(caseTypes)
                 .rangeRound([0, x0.bandwidth()])
                 .padding(0.05);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.Case_Count)])
                .nice()
                .rangeRound([height - margin.bottom, margin.top]);

    // Create color scale
    const color = d3.scaleOrdinal()
                    .domain(caseTypes)
                    .range(d3.schemeCategory10);

    // Create grouped bars
    svg.append('g')
       .selectAll('g')
       .data(data)
       .join('g')
       .attr('transform', d => `translate(${x0(d.Year_Period)},0)`)
       .selectAll('rect')
       .data(d => caseTypes.map(type => ({ Year_Period: d.Year_Period, type, value: d.Case_Count })))
       .join('rect')
       .attr('x', d => x1(d.type))
       .attr('y', d => y(d.value))
       .attr('width', x1.bandwidth())
       .attr('height', d => height - margin.bottom - y(d.value))
       .attr('fill', d => color(d.type));

    // Create x-axis
    svg.append('g')
       .attr('transform', `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(x0))
       .selectAll('text')
       .attr('transform', 'rotate(-45)')
       .style('text-anchor', 'end');

    // Create y-axis
    svg.append('g')
       .attr('transform', `translate(${margin.left},0)`)
       .call(d3.axisLeft(y));

    // Create legend
    const legend = svg.append('g')
                     .attr('transform', `translate(${width - margin.right},${margin.top})`)
                     .attr('text-anchor', 'end')
                     .style('font', '12px sans-serif')
                     .selectAll('g')
                     .data(caseTypes.slice().reverse())
                     .join('g')
                     .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
          .attr('x', -19)
          .attr('width', 19)
          .attr('height', 19)
          .attr('fill', color);

    legend.append('text')
          .attr('x', -24)
          .attr('y', 9.5)
          .attr('dy', '0.35em')
          .text(d => d);
}
