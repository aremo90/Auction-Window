let prevBidder = '';

// Safe element updates with null checks
const setTextContent = (id, text) => {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
};


async function fetchAuction() {
  try {
    const response = await fetch('http://162.55.136.196:3000/api/auctions');
    const auctions = await response.json();
    if (auctions.length > 0) {
      const a = auctions[0];

      // Parse ISO 8601 format (2025-06-09T01:47:43.287Z)
      const endTime = new Date(a.EndTime).getTime();
      if (isNaN(endTime)) {
        console.error("Invalid EndTime format:", a.EndTime);
        return;
      }
      const timeLeft = endTime - Date.now();

      // Only proceed if timeLeft is positive (auction hasn't ended)
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        // Update UI
        setTextContent('item-name', a.ItemName || a.ItemCodeName);
        setTextContent('time-left', `${days}d ${hours}h ${minutes}m ${seconds}s`);
        setTextContent('current-bid', a.CurrentBid ? `${a.CurrentBid} ${a.CurrencyType}` : `${a.StartBid} ${a.CurrencyType}`);
        setTextContent('top-bidder', a.CurrentHighestBidderCharName || 'No bids yet');
        document.getElementById('auction-img').innerHTML = `<img class="rounded-3xl border-4 border-slate-600" src="${a.ImageURL}" alt="">`;
        // Update prevBidder
        prevBidder = a.CurrentHighestBidderCharName || 'No bids yet';
      }
    }
    else {
      document.getElementById('auction').innerHTML = `
        <h1 class="text-2xl text-white">There is no active auction. Please check back later.</h1>
      `;
    }
  } catch (error) {
    console.error("Error fetching auction:", error);
  }
}


async function placeBid() {
  // Get charName from URL
  const urlParams = new URLSearchParams(window.location.search);
  const charName = urlParams.get('charname');

  if (!charName) {
    return alert("Something went wrong.");
  }

  const bidInput = document.getElementById('bid-input');
  const amount = parseInt(bidInput.value);
  if (charName === prevBidder) return setTextContent('bid-error', 'You are already the top bidder.');
  if (!amount || amount <= 0) return setTextContent('bid-error', 'Please enter a valid bid amount.');;

  try {
    const res = await fetch('http://162.55.136.196:3000/api/auctions/1/bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CharName: charName,  // Using the dynamic charName from URL
        BidAmount: amount,
        CurrencyType: "silk"
      })
    });
    const result = await res.json();
    setTextContent('bid-error', result.ErrorMessage);
    document.getElementById('bid-input').value = '';
    fetchAuction();
  } catch (err) {
    console.error("Bid failed:", err);
    alert("Something went wrong.");
  }
}




window.onload = function () {
  fetchAuction(); // Initial load
  setInterval(fetchAuction, 1000); // Refresh every 1000ms (1s)
};