var svg = d3.select("svg");
var margin = { top: 50, right: 10, bottom: 50, left: 10 };
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var color = d3.scaleOrdinal(d3.schemeCategory10);
var radius = 8;
var minDist = radius + 1;
var trackDist = 30;

// pseudo-enum for handling groups
var groups = {
/*
  "History": 0,
  "HMD": 1,
  "Movie": 2,
  "Literature": 3,
  "NONE": 4
*/
  'History': 0,
  'AR': 1,
  'Computing':2,
  'Console':3,
  'Device':4,
  'HMD':5,
  'Literature':6,
  'Movie':7,
  'Software':8,
  'Videogame':9,
  'Virtualworld':10,
  'Simulator':11


};

var formatValue = d3.format("d");

var x = d3.scaleLinear()
  .range([0, width]);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("vr_history-master/data2.json", function(data) {
	x.domain(d3.extent(data, d => d.start_year )); // TODO fix extent

  var div = d3.select('#timeline')
    .selectAll('div')
    .data(data).enter()
    .append('div')
    .attr("class", "item styled collapsed")
    .attr("data-type", d => { return d.type; } )
    .attr("title", d => { return d.name; } )
    .attr("id", d => { "i" + d.id; } )
    //.style("background-color", d => color(groups[d.type === "" ? "NONE" : d.type]) )
    .on("click", function (d) {
      var c = d3.select(this);
      if(c.attr("class") != "item expanded") {
        c.attr("class", "item expanded"); // TODO also give expanded to d
      } else {
        c.attr("class", "item collapsed");
      }
    })


    div.append('div')
      .attr("class", "content")
      .html(function(d) {
        return "<a href=\"#\" class=\"closeicon\"><img src=\"img\/close.svg\"></a><div class=\"img-holder\" style=\"background-image: url(" + d.img + ")\">&nbsp;</div><h1>" + d.name + "</h1>" + "<small>(" + d.start_year + ")</small>" + "<p class=\"desc\">" +  d.description + "</p>" + "<div class=\"links\"><small>Links:</small><br />" + d.links + "</div><div class=\"sources\"><small>Sources:</small><br />" + d.sources + "</div>";
      });

  // X-axis - I suppose it's still easiest to do that in svg?
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(20, ""));

  var simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(function(d) { return x(d.start_year); }).strength(1))
    .force("y", d3.forceY(function(d) { return groups[d.type === "" ? "NONE" : d.type] * trackDist; }).strength(1))
    .force("collide", d3.forceCollide(function(d) { return minDist; })); // TODO collision on a per-node basis -> push things out when expanding


  simulation.on("tick", function() {
    div.style("left", function(d) { return d.x + 72 + "px"; }); // TODO yeah magic numbers, sue me
    div.style("top", function(d) { return d.y + 100 + "px"; });
  });




});
