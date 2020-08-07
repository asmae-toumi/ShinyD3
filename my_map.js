
// D3 maps!


r2d3.onRender(function(json, svg, width, height, options) {
  
var color = d3.scaleThreshold()
  .range(["#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"])
  .domain([250, 500, 750, 1000, 1250, 1500, 1750, 2000]);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  var projection = d3.geoAlbersUsa();

  var path = d3.geoPath()
      .projection(projection);

  svg.attr("width", width)
     .attr("height", height);

  var states = topojson.feature(json, json.objects.states);

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(states),
      s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  svg.append("path")
      .datum(states)
      .attr("class", "feature")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(json, json.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);
});
