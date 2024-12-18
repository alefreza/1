document.addEventListener("DOMContentLoaded", function () {
  let chartInstance = null;

  function calculateBandwidth() {
    // Retrieve input values
    const numVMs = parseFloat(document.getElementById("numVMs").value);
    const numDisks = parseFloat(document.getElementById("numDisks").value);
    const diskSize = parseFloat(document.getElementById("diskSize").value);
    const capacityUtilization = parseFloat(document.getElementById("capacityUtilization").value) / 100;
    const compression = document.getElementById("compression").value;
    const dailyChangeRate = parseFloat(document.getElementById("dailyChangeRate").value) / 100;
    const burstChangeRate = parseFloat(document.getElementById("burstChangeRate").value) / 100;
    const rpo = parseFloat(document.getElementById("rpo").value);

    // Validation: Ensure all fields are correctly filled
    if (isNaN(numVMs) || isNaN(numDisks) || isNaN(diskSize) || isNaN(capacityUtilization)
      || isNaN(dailyChangeRate) || isNaN(burstChangeRate) || isNaN(rpo)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Calculation logic
    const totalData = numVMs * numDisks * diskSize * capacityUtilization;
    const dailyChange = totalData * dailyChangeRate;
    const burstChange = totalData * burstChangeRate;
    const compressionFactor = compression === "Yes" ? 0.5 : 1; // If compression is enabled, reduce data
    const dataPerRPO = ((dailyChange / 24 / 60) * rpo + burstChange) * compressionFactor; // Data within RPO window
    const requiredBandwidth = (dataPerRPO * 8) / (rpo * 60); // Convert GB to Mbps

    // Update output result
    document.getElementById("bandwidthOutput").innerHTML =
      `Recommended Bandwidth: <strong>${requiredBandwidth.toFixed(2)} Mbps</strong>`;

    // Update the chart
    updateChart(requiredBandwidth);
  }

  function updateChart(bandwidth) {
    const ctx = document.getElementById("bandwidthChart").getContext("2d");

    // Destroy any existing chart instance
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Custom plugin to display text in the center of the doughnut chart
    const centerTextPlugin = {
      id: "centerText",
      beforeDraw: function (chart) {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;

        ctx.restore();
        const fontSize = (height / 200).toFixed(1);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        const text = `${bandwidth.toFixed(1)} Mbps`;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillStyle = "#000"; // Text color
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    };

    // Create a new doughnut chart
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Bandwidth (Mbps)"],
        datasets: [{
          data: [bandwidth],
          backgroundColor: ["#4CAF50"],
          hoverBackgroundColor: ["#45a049"]
        }]
      },
      options: {
        responsive: false,
        cutout: "80%", // Doughnut hole size
        plugins: {
          legend: {
            display: false // Hide the legend
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.raw.toFixed(2)} Mbps`;
              }
            }
          }
        }
      },
      plugins: [centerTextPlugin] // Add custom plugin
    });
  }

  // Add event listener to the calculate button
  document.getElementById("calculateBtn").addEventListener("click", calculateBandwidth);
});
