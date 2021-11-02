// // set the dimensions and margins of the graph
// const margin = {top: 10, right: 10, bottom: 10, left: 10},
//     width = 1200 - margin.left - margin.right,
//     height = 1200 - margin.top - margin.bottom,
//     innerRadius = 80,
//     outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// // append the svg object to the body of the page
// const svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${width/2},${height/2+100})`); // Add 100 on Y translation, cause upper bars are longer

// d3.json("https://raw.githubusercontent.com/tee-huynh/spotifycts/main/js/StreamingHistory0.json").then( function(data) {

//   // X scale
//   const x = d3.scaleBand()
//       .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
//       .align(0)                  // This does nothing ?
//       .domain( data.map(d => d.artistName)); // The domain of the X axis is the list of states.

//   // Y scale
//   const y = d3.scaleRadial()
//       .range([innerRadius, outerRadius])   // Domain will be define later.
//       .domain([0, 10000]); // Domain of Y is from 0 to the max seen in the data

//   // Add bars
//   svg.append("g")
//     .selectAll("path")
//     .data(data)
//     .join("path")
//       .attr("fill", "#1ed760")
//       .attr("d", d3.arc()     // imagine your doing a part of a donut plot
//           .innerRadius(innerRadius)
//           .outerRadius(d => y(d['msPlayed']))
//           .startAngle(d => x(d.artistName))
//           .endAngle(d => x(d.artistName) + x.bandwidth())
//           .padAngle(0.01)
//           .padRadius(innerRadius))

// });

const file = 'https://raw.githubusercontent.com/tee-huynh/spotifycts/main/js/StreamingHistory0.json';
const width2 = window.innerWidth;
const height2 = window.innerHeight;
const colors = {
    html: '#F16529',
    css: '#1C88C7',
    js: '#FCC700'
};

const generateChart = data => {
    const bubble = data => d3.pack()
        .size([width2, height2])
        .padding(10)(d3.hierarchy({ children: data }).sum(d => d.msPlayed));

    const svg = d3.select('#bubble-chart')
        .style('width', width2)
        .style('height', height2);
    
    const root = bubble(data);
    const tooltip = d3.select('.tooltip');

    const node = svg.selectAll()
        .data(root.children)
        .enter().append('g')
        .attr('transform', `translate(${width2 / 2}, ${height2 / 2})`);
    
    const circle = node.append('circle')
        .style('fill', '#1ed760')
        .on('mouseover', function (e, d) {
            tooltip.select('img').attr('src', d.data.img);
            tooltip.select('a').attr('href', d.data.link).text(d.data.artistName);
            tooltip.select('span').attr('class', d.data.artistName).text(d.data.artistName);
            tooltip.style('visibility', 'visible');

            d3.select(this).style('stroke', '#222');
        })
        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        })
        .on('click', (e, d) => window.open(d.data.link));
    
    const label = node.append('text')
        .attr('dy', 2)
        .text(d => d.data.artistName.substring(0, d.r / 3));

    node.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    circle.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('r', d => d.r);
    
    label.transition()
        .delay(700)
        .ease(d3.easeExpInOut)
        .duration(1000)
        .style('opacity', 1)
};

(async () => {
    data = await d3.json(file).then(data => data);
    generateChart(data);
})();
