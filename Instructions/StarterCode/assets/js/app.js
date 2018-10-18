var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#jabroni")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  // console.log("Hello");
d3.csv("assets/js/data.csv", function(error, healthdata) {
  if (error) throw error;
  console.log("Hello");
  healthdata.forEach(function(data) {
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;
    
  });

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthdata, d => d.smokes)-2, d3.max(healthdata, d => d.smokes)+2])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthdata, d => d.poverty)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthdata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.smokes))
  .attr("cy", d => yLinearScale(d.poverty))
  .attr("r", "15")
  .attr("fill", "pink")
  .attr("opacity", ".5");

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br> Smokes : ${d.smokes}<br> Poverty : ${d.poverty}`);
    });

  chartGroup.call(toolTip);

  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })

    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percentage of Poverty");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Percentage of Smokers");
});
