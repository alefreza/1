document.getElementById('bandwidthForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get user inputs
  const vmDataSize = parseFloat(document.getElementById('vmDataSize').value);  // Total VM Data Size (GB)
  const changeRate = parseFloat(document.getElementById('changeRate').value);  // Daily Change Rate (GB)
  const replicationInterval = parseFloat(document.getElementById('replicationInterval').value);  // Replication Interval (hours)

  // Convert replication interval to seconds
  const replicationIntervalSeconds = replicationInterval * 3600;

  // Calculate Bandwidth
  const bandwidth = (vmDataSize * changeRate) / (replicationIntervalSeconds * 1024);

  // Display the result
  document.getElementById('bandwidthResult').innerText = `Required Bandwidth: ${bandwidth.toFixed(2)} Mbps`;
});
