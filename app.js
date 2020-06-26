//Use the D3 library to read in `samples.json`
function buildPlot(sample) {
   d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var result = metadata.filter(sampleObject => sampleObject.id == sample);
      var result2 = result[0];
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result2).forEach(([key, value]) => {
         PANEL.append("h6").text(`${key.toUpperCase()}:${value}`);
      });
   })};

function init() {
   var selector = d3.select("#selDataset");
   d3.json("samples.json").then((data) => {
      var samplenames = data.names;
      samplenames.forEach((sample) => {
         selector.append("option").text(sample).property("value", sample);
      });
      var firstsample = samplenames[0];
      buildPlot(firstsample);
      buildCharts(firstsample);
   });
}   

function optionChanged(newsample) {
   buildPlot(newsample);
   buildCharts(newsample);
};

function buildCharts(sample) {
   d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var result = samples.filter(sampleObject => sampleObject.id == sample);
      var result2 = result[0];
      var otu_ids = result2.otu_ids;
      var otu_labels = result2.otu_labels;
      var sample_values = result2.sample_values;
      var yData = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
      
      var barData = [
         {
            y: yData,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
         }
      ];
      var barChartLayout = {
         title: "Top ten OTUs <br> (operational taxonomic units)",
         margin: {
            t: 60,
            l: 100
         }
      };
      Plotly.newPlot("bar", barData, barChartLayout);

      var bubbleData = [
         {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
               size: sample_values,
               color: otu_ids,
               colorscale: "Earth"
            }
         }
      ];
      var bubbleChartLayout = {
         title: "Microbial Species by Sample",
         margin: {
            t: 0
         },
         hovermode: "closest",
         xaxis: {
            title: "OTU_ID",  
         },
         margin: {
            t: 30
         }
      };
      Plotly.newPlot("bubble", bubbleData, bubbleChartLayout);

   });
};

init();
