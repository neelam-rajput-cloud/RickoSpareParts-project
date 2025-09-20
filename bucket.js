document.addEventListener("DOMContentLoaded", () => {
  const bucketBtn = document.getElementById("bucketBtn");
  const bucketModal = document.getElementById("bucketModal");
  const closeBucket = document.getElementById("closeBucket");

  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckout = document.getElementById("closeCheckout");
  const checkoutSummary = document.getElementById("checkout-summary");
  const confirmOrder = document.getElementById("confirmOrder");

  // --- Bucket modal open/close ---
  bucketBtn.addEventListener("click", () => {
    renderBucket();
    bucketModal.classList.remove("hidden");
    bucketModal.classList.add("flex");
  });

  closeBucket.addEventListener("click", () => {
    bucketModal.classList.add("hidden");
    bucketModal.classList.remove("flex");
  });

  bucketModal.addEventListener("click", (e) => {
    if (e.target === bucketModal) {
      bucketModal.classList.add("hidden");
      bucketModal.classList.remove("flex");
    }
  });

  // --- Checkout modal open ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
      if (bucket.length === 0) {
        alert("Your bucket is empty!");
        return;
      }

      let total = 0;
      checkoutSummary.innerHTML = "";
      bucket.forEach((item) => {
        total += item.price * item.quantity;
        checkoutSummary.innerHTML += `<p>${item.name} x ${item.quantity} = Rs.${
          item.price * item.quantity
        }</p>`;
      });
      checkoutSummary.innerHTML += `<p class="font-bold mt-2">Total: Rs.${total}</p>`;

      checkoutModal.classList.remove("hidden");
      checkoutModal.classList.add("flex");
    });
  }

  // --- Checkout modal close ---
  closeCheckout.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
    checkoutModal.classList.remove("flex");
  });

  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.add("hidden");
      checkoutModal.classList.remove("flex");
    }
  });

  confirmOrder.addEventListener("click", () => {
    const name = document.getElementById("userName").value.trim();
    const contact = document.getElementById("userContact").value.trim();
    const address = document.getElementById("userAddress").value.trim();

    if (!name || !contact || !address) {
      alert("Please enter your name, contact number, and address.");
      return;
    }

    alert(
      `Thank you ${name}! Your order has been placed.\nAddress: ${address}\nContact: ${contact}`
    );

    // Clear bucket
    localStorage.removeItem("bucket");
    renderBucket();
    updateBucketCount();

    // Close modals
    checkoutModal.classList.add("hidden");
    checkoutModal.classList.remove("flex");
    bucketModal.classList.add("hidden");
    bucketModal.classList.remove("flex");
  });

  // --- Existing add to bucket ---
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
      const index = e.target.dataset.index;
      const product = products[index];

      let bucket = JSON.parse(localStorage.getItem("bucket")) || [];
      const existingItem = bucket.find((item) => item.id === index);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        bucket.push({
          id: index,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }

      localStorage.setItem("bucket", JSON.stringify(bucket));
      updateBucketCount();
    }
  });

  // --- Initial render ---
  renderBucket();
  updateBucketCount();
});

// --- Existing renderBucket / deleteItem / updateBucketCount functions ---
function renderBucket() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const container = document.getElementById("bucket-items");
  const totalPriceEl = document.getElementById("total-price");

  container.innerHTML = "";
  let total = 0;

  if (bucket.length === 0) {
    container.innerHTML = `<p class="text-gray-400">Your bucket is empty</p>`;
    totalPriceEl.textContent = "";
    return;
  }

  bucket.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="bg-[#0090ff] border p-2 rounded flex justify-between items-center w-[70%]">
        <div>
          <h2 class="text-lg text-gray-100 font-semibold">${item.name}</h2>
          <p class="text-white">Rs. ${item.price} × ${item.quantity}</p>
        </div>
        <button
          class="h-[38px] w-[80px] bg-green-500 rounded-md text-white font-semibold hover:bg-red-600"
          onclick="deleteItem(${index})"
        >
          Delete
        </button>
      </div>
    `;
  });

  totalPriceEl.textContent = total;
}

function deleteItem(index) {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  bucket.splice(index, 1);
  localStorage.setItem("bucket", JSON.stringify(bucket));
  renderBucket();
  updateBucketCount();
}

function updateBucketCount() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const bucketCount = document.getElementById("bucketCount");
  bucketCount.textContent = bucket.length;
}
