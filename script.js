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

    if (isNaN(numVMs) || isNaN(numDisks) || isNaN(diskSize) || isNaN(capacityUtilization)
      || isNaN(dailyChangeRate) || isNaN(burstChangeRate) || isNaN(rpo)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Calculation logic
    const totalData = numVMs * numDisks * diskSize * capacityUtilization;
    const dailyChange = totalData * dailyChangeRate;
    const burstChange = totalData * burstChangeRate;
    const compressionFactor = compression === "Yes" ? 0.5 : 1;
    const dataPerRPO = ((dailyChange / 24 / 60) * rpo + burstChange) * compressionFactor;
    const requiredBandwidth = (dataPerRPO * 8) / (rpo * 60);

    // Update output
    document.getElementById("bandwidthOutput").innerHTML = `Recommended Bandwidth: <strong>${requiredBandwidth.toFixed(2)} Mbps</strong>`;

    // Update chart
    updateChart(requiredBandwidth);
  }

  function updateChart(bandwidth) {
    const ctx = document.getElementById("bandwidthChart").getContext("2d");
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Bandwidth (Mbps)", "Remaining"],
        datasets: [{
          data: [bandwidth, 100 - bandwidth],
          backgroundColor: ["#4CAF50", "#E0E0E0"]
        }]
      },
      options: {
        responsive: false,
        cutout: "80%"
      }
    });
  }

  document.getElementById("calculateBtn").addEventListener("click", calculateBandwidth);
});
