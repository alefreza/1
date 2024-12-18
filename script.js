document.addEventListener("DOMContentLoaded", function () {
  let chartInstance = null; // Track the current chart instance

  function calculateBandwidth() {
    // Input values
    const numVMs = parseFloat(document.getElementById("numVMs").value);
    const numDisks = parseFloat(document.getElementById("numDisks").value);
    const diskSize = parseFloat(document.getElementById("diskSize").value);
    const capacityUtilization = parseFloat(document.getElementById("capacityUtilization").value) / 100;
    const compression = document.getElementById("compression").value;
    const dailyChangeRate = parseFloat(document.getElementById("dailyChangeRate").value) / 100;
    const burstChangeRate = parseFloat(document.getElementById("burstChangeRate").value) / 100;
    const rpo = parseFloat(document.getElementById("rpo").value);

    // Validate input
    if (
      isNaN(numVMs) || isNaN(numDisks) || isNaN(diskSize) || isNaN(capacityUtilization) ||
      isNaN(dailyChangeRate) || isNaN(burstChangeRate) || isNaN(rpo)
    ) {
      alert("Please fill all inputs correctly!");
      return;
    }

    // Step 1: Total data to be replicated
    const totalData = numVMs * numDisks * diskSize * capacityUtilization;

    // Step 2: Daily data change (GB)
    const dailyChange = totalData * dailyChangeRate;

    // Step 3: Burst change adjustment
    const burstChange = totalData * burstChangeRate;

    // Step 4: Compression adjustment
    const compressionFactor = compression === "Yes" ? 0.5 : 1.0; // Assume 50% reduction
    const adjustedDailyChange = dailyChange * compressionFactor;
    const adjustedBurstChange = burstChange * compressionFactor;

    // Step 5: Data per RPO and bandwidth
    const dataPerRPO = (adjustedDailyChange / 24 / 60) * rpo + adjustedBurstChange;
    const requiredBandwidth = (dataPerRPO * 8) / (rpo * 60); // Convert to Mbps

    // Update chart and output
    updateChart(requiredBandwidth);
    displayBandwidthOutput(requiredBandwidth);
  }

  function updateChart(bandwidth) {
    const ctx = document.getElementById("bandwidthChart").getContext("2d");

    // Destroy previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create new chart
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [bandwidth, 100 - bandwidth], // Represent bandwidth and unused space
          backgroundColor: ["#4CAF50", "#E0E0E0"], // Green for bandwidth, gray for unused
        }],
        labels: ["Bandwidth (Mbps)", "Remaining"]
      },
      options: {
        responsive: false, // Disable responsive resizing
        maintainAspectRatio: false, // Allow custom dimensions
        cutoutPercentage: 80, // Control doughnut hole size
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return (
                data.labels[tooltipItem.index] +
                ": " +
                data.datasets[0].data[tooltipItem.index].toFixed(2) +
                " Mbps"
              );
            }
          }
        }
      }
    });
  }

  function displayBandwidthOutput(bandwidth) {
    document.getElementById("bandwidthOutput").innerHTML =
      `Recommended Bandwidth: <strong>${bandwidth.toFixed(2)} Mbps</strong>`;
  }

  // Attach the function to the button click
  document.querySelector("button").addEventListener("click", calculateBandwidth);
});
