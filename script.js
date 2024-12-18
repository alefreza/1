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

    // Create a new doughnut chart with only the bandwidth section
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Bandwidth (Mbps)"], // Single label
        datasets: [{
          data: [bandwidth], // Single data point
          backgroundColor: ["#4CAF50"], // Green color for the bandwidth section
          hoverBackgroundColor: ["#45a049"] // Slightly darker green on hover
        }]
      },
      options: {
        responsive: false,
        cutout: "80%", // Doughnut hole size
        plugins: {
          legend: {
            display: false // Hide the legend to clean up UI
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.raw.toFixed(2)} Mbps`; // Custom tooltip format
              }
            }
          }
        }
      }
    });
  }

  // Add event listener to calculate button
  document.getElementById("calculateBtn").addEventListener("click", calculateBandwidth);
});
