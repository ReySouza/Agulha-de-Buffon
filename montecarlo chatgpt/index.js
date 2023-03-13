const needleLength = 1;
const lineWidth = 0.3;
const numPoints = 1000;
const numLines = 5;

// Define the distance between the lines
const gridSpacing = 10;

// Define the positions of the lines
const linePositions = new Array(numLines);
const lineSpacing = gridSpacing / numLines;
for (let i = 0; i < numLines; i++) {
  linePositions[i] = i * lineSpacing;
}

function generatePoints(numPoints) {
  const x = Array.from({ length: numPoints }, () => Math.random() * gridSpacing);
  const y = Array.from({ length: numPoints }, () => Math.random() * gridSpacing);
  const angles = Array.from({ length: numPoints }, () => Math.random() * Math.PI);
  return { x, y, angles };
}

// Define the function to count how many needles cross the lines
function countCrossings(x, y) {
  const { numCrossings, colors, xs, ys, crossingIndices, nonCrossingIndices } = x.reduce(
    ({ numCrossings, colors, xs, ys, crossingIndices, nonCrossingIndices }, _, i) => {
      const crossing = linePositions.some((lineStart) => {
        const lineEnd = lineStart + needleLength;
        return y[i] >= lineStart && y[i] <= lineEnd;
      });
      if (crossing) {
        colors.push("red");
        numCrossings++;
        crossingIndices.push(i);
      } else {
        colors.push("green");
        nonCrossingIndices.push(i);
      }
      xs.push(x[i], x[i] + (needleLength / 2) * Math.cos(angles[i]));
      ys.push(y[i], y[i] + (needleLength / 2) * Math.sin(angles[i]));
      return { numCrossings, colors, xs, ys, crossingIndices, nonCrossingIndices };
    },
    { numCrossings: 0, colors: [], xs: [], ys: [], crossingIndices: [], nonCrossingIndices: [] }
  );
  // Return the object with the properties numCrossings, colors, xs, and ys
  return { numCrossings, colors, xs, ys, crossingIndices, nonCrossingIndices };
}

// Generate the random points and count how many needles cross the lines
const points = generatePoints(numPoints);
const { numCrossings, colors, xs, ys, crossingIndices, nonCrossingIndices } = countCrossings(points.x, points.y);
const piEstimate = (2 * numPoints * needleLength) / (numCrossings * lineSpacing);

// Define the data for the plot, including the lines
const lineData = linePositions.map((position) => {
  return {
    x: [0, gridSpacing],
    y: [position, position],
    mode: "lines",
    line: { width: lineWidth, color: "rgba(0, 0, 0, 0.7)" },
    type: "scatter"
  };
});

const crossingNeedleData = {
  x: [],
  y: [],
  mode: "lines",
  line: { width: lineWidth, color: "red" },
  type: "scatter",
  marker: { color: [] }
};

const nonCrossingNeedleData = {
  x: [],
  y: [],
  mode: "lines",
  line: { width: lineWidth, color: "green" },
  type: "scatter",
  marker: { color: [] }
};

// Populate the needle data arrays
crossingIndices.forEach((i) => {
  crossingNeedleData.x.push(xs[i], xs[i] + (needleLength / 2) * Math.cos(Math.PI * ys[i] / gridSpacing), null);
  crossingNeedleData.y.push(ys[i], ys[i] + (needleLength / 2) * Math.sin(Math.PI * ys[i] / gridSpacing), null);
  crossingNeedleData.marker.color.push(colors[i], colors[i], null);
});

nonCrossingIndices.forEach((i) => {
  nonCrossingNeedleData.x.push(xs[i], xs[i] + (needleLength / 2) * Math.cos(Math.PI * ys[i] / gridSpacing), null);
  nonCrossingNeedleData.y.push(ys[i], ys[i] + (needleLength / 2) * Math.sin(Math.PI * ys[i] / gridSpacing), null);
  nonCrossingNeedleData.marker.color.push(colors[i], colors[i], null);
});

const data = [...lineData, crossingNeedleData, nonCrossingNeedleData];

// Define the layout for the plot
const layout = {
  title: `Estimate of pi: ${piEstimate}`,
  xaxis: { range: [0, gridSpacing] },
  yaxis: { range: [0, gridSpacing] }
};

// Create the plot
Plotly.newPlot("plot", data, layout);
