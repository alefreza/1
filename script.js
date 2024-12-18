function calculateBandwidth() {
  // Input values
  const numVMs = parseFloat(document.getElementById("numVMs").value);
  const diskSize = parseFloat(document.getElementById("diskSize").value);
  const changeRate = parseFloat(document.getElementById("changeRate").value) / 100; // convert to decimal
  const rpo = parseFloat(document.getElementById("rpo").value); // RPO in minutes

  // Validate inputs
  if (isNaN(numVMs) || isNaN(diskSize) || isNaN(changeRate) || isNaN(rpo)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  // Calculations
  const totalData = numVMs * diskSize; // Total data to be replicated (GB)
  const dailyChange = totalData * changeRate; // Daily data change (GB)
  const dataPerRPO = (dailyChange / 24 / 60) * rpo; // Data per RPO (GB)
  const requiredBandwidth = (dataPerRPO * 8) / (rpo * 60); // Bandwidth in Mbps

  // Display result
  document.getElementById("result").innerHTML =
    `Recommended Bandwidth: <span>${requiredBandwidth.toFixed(2)} Mbps</span>`;
}
