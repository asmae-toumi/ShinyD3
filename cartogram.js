var width = 960,
    height = 500;

var color = d3.scaleThreshold()
  .range(["#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"])
  .domain([250, 500, 750, 1000, 1250, 1500, 1750, 2000]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

d3.queue()
    .defer(d3.tsv, "infants-1999-2015.txt")
    .defer(d3.json, "us.json")
    .await(ready);

function ready(error, deaths, us) {
  if (error) return console.warn(error);

  deathsByFips = {};
  deaths.forEach(function(d) {
    d.Deaths = +d.Deaths;
    d.Population = +d.Population;
    d["Crude Rate"] = +(d["Crude Rate"].replace(" (Unreliable)", ""));
    deathsByFips[+d["County Code"]] = d;
  });

  // uncomment to see extent of mortality rate (min/max counties)
  //console.log(d3.extent(deaths, function(d) { return d["Crude Rate"] }));

  var format = d3.format(".2%");
  var commas = d3.format(",");

  var path = d3.geoPath()
    .projection(d3.geoAlbersUsa());

  var subset = topojson.feature(us, us.objects.counties).features.filter(function(d) {
    return d.id in deathsByFips;
  });

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(subset)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { 
        return color(deathsByFips[d.id]["Crude Rate"]);
      })
      .on("mouseover", function(d) {
        var val = deathsByFips[d.id];
        var fill_color = color(val["Crude Rate"]);
        tooltip.html("");
        tooltip.style("visibility", "visible")
          .style("border", "3px solid " + fill_color);

        tooltip.append("h3").text(val.County);
        tooltip.append("div")
          .text("Infants: " + commas(val["Population"]));
        tooltip.append("div")
          .text("Deaths: " + commas(val["Deaths"]));
        tooltip.append("div")
          .text("Mortality Rate: " + format(val["Crude Rate"]/100000));

        d3.selectAll(".counties path")
          .style("opacity", 0.3)
          .style("stroke", null);
        d3.select(this)
          .style("opacity", 1)
          .style("stroke", "#222")
          .raise();
        d3.selectAll(".states")
          .style("opacity", 0);
      })
      .on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY-52) + "px").style("left", (d3.event.pageX+18) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden")
        d3.selectAll(".counties path")
          .style("opacity", 1);
        d3.selectAll(".states")
          .style("opacity", 1);
      });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
      .attr("class", "states")
      .attr("d", path);

  svg.append("text")
    .style("font-weight", "bold")
    .attr("x", width - 176)
    .attr("y", height - 152)
    .text("Infant Mortality");

  var legend = svg.selectAll(".legend")
    .data(color.domain().reverse())
    .enter().append("g")
    .attr("transform", function(d,i) {
      return "translate(" + (width-139) + "," + (height - 144 + 16 * i) + ")";
    })

  legend.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", function(d) {
      return color(d);
    });

  legend.append("text")
    .attr("x", 16)
    .attr("y", 11)
    .style("font-size", "12px")
    .text(function(d) {
      return format(d/100000);
    });
}