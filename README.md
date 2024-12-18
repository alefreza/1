How It Works:

    HTML (index.html):
        A simple form where users can input:
            Total VM data size (in GB)
            Daily change rate (in GB)
            Replication interval (in hours)
        The form is styled with basic CSS for user-friendly input.

    CSS (styles.css):
        Basic styling to make the page look clean and presentable.

    JavaScript (script.js):

        Listens for the form submission event and performs the bandwidth calculation.

        The formula used is:
        Bandwidth Required (Mbps)=VM Data Size×Daily Change RateReplication Interval in Seconds×1024
        Bandwidth Required (Mbps)=Replication Interval in Seconds×1024VM Data Size×Daily Change Rate​

        The result is then displayed on the page.
