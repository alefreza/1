document.addEventListener("DOMContentLoaded", function() {
  let chartInstance = null;

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
    if (isNaN(numVMs) || isNaN(numDisks) || isNaN(diskSize) || isNaN(capacityUtilization) ||
        isNaN(dailyChangeRate) || isNaN(burstChangeRate) || isNaN(rpo)) {
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

    // Update chart
    updateChart(requiredBandwidth);

    // Display bandwidth
    document.getElementById("bandwidthOutput").innerHTML =
      `Recommended Bandwidth: <strong>${requiredBandwidth.toFixed(2)} Mbps</strong>`;
  }

  function updateChart(bandwidth) {
    const ctx = document.getElementById("bandwidthChart").getContext("2d");

    if (chartInstance) {
      chartInstance.destroy(); // Destroy the old chart instance
    }

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [bandwidth, 100 - bandwidth], // Show bandwidth and remaining
          backgroundColor: ["#4CAF50", "#E0E0E0"], // Green for bandwidth
        }],
        labels: ["Bandwidth (Mbps)", "Remaining"]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.labels[tooltipItem.index] + ": " + data.datasets[0].data[tooltipItem.index].toFixed(2) + " Mbps";
            }
          }
        }
      }
    });
  }

  // Attach the function to the button click
  document.querySelector('button').addEventListener('click', calculateBandwidth);
});
