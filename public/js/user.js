document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Tab switching logic
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active from all
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.add("hidden"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active to clicked
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId).classList.remove("hidden");
      document.getElementById(targetId).classList.add("active");

      // Load data based on tab
      if (targetId === "info") loadUserInfo();
      if (targetId === "myBooks") loadBooks();
    });
  });

  // Load user info on init
  loadUserInfo();

  // Handle Logout
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  });

  // Handle Add Book
  document
    .getElementById("addBookForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("bookTitle").value;
      const author = document.getElementById("authorName").value;
      const publishedDate = document.getElementById("publishedDate").value;

      const msgEl = document.getElementById("bookMessage");

      try {
        const res = await fetch("/api/v1/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author, publishedDate }),
        });

        if (res.ok) {
          msgEl.textContent = "Book added successfully!";
          msgEl.className = "message success";
          e.target.reset();
        } else {
          const data = await res.json();
          msgEl.textContent = data.message || "Error adding book.";
          msgEl.className = "message error";
        }
      } catch (err) {
        msgEl.textContent = "Network error.";
        msgEl.className = "message error";
      }
    });

  // Functions
  async function loadUserInfo() {
    const infoCard = document.getElementById("infoCard");
    try {
      const res = await fetch("/api/v1/auth/profile");
      if (!res.ok) {
        if (res.status === 401) window.location.href = "/login";
        throw new Error("Failed to load profile");
      }
      const data = await res.json();
      const user = data.data;

      infoCard.innerHTML = `
        <div class="info-row"><strong>Name:</strong> <span>${user.name}</span></div>
        <div class="info-row"><strong>Email:</strong> <span>${user.email}</span></div>
        <div class="info-row"><strong>Mobile:</strong> <span>${user.mobile}</span></div>
      `;
      infoCard.classList.remove("loading");
    } catch (err) {
      infoCard.innerHTML =
        '<p class="error">Failed to load user information.</p>';
    }
  }

  async function loadBooks() {
    const list = document.getElementById("booksList");
    list.innerHTML = "<p>Loading books...</p>";

    try {
      const res = await fetch("/api/v1/books");
      if (!res.ok) throw new Error("Failed to load books");
      const data = await res.json();

      // Assuming paginated response from book controller
      const books = data.data.books || data.data || [];

      if (books.length === 0) {
        list.innerHTML = "<p>No books found. Add one!</p>";
        return;
      }

      list.innerHTML = books
        .map(
          (book) => `
        <div class="book-card" data-id="${book._id || book.id}">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <div class="book-actions">
            <button class="view-btn" onclick="viewBook('${book._id || book.id}')">View</button>
            <button class="delete-btn" onclick="deleteBook('${book._id || book.id}')">Delete</button>
          </div>
        </div>
      `,
        )
        .join("");
    } catch (err) {
      list.innerHTML = '<p class="error">Failed to load books.</p>';
    }
  }

  // Global functions for inline handlers
  window.viewBook = async (id) => {
    try {
      const res = await fetch(`/api/v1/books/${id}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      const book = data.data;

      document.getElementById("modalTitle").textContent = book.title;
      document.getElementById("modalAuthor").textContent = book.author;
      document.getElementById("modalDate").textContent = new Date(
        book.publishedDate,
      ).toLocaleDateString();

      document.getElementById("bookModal").classList.remove("hidden");
    } catch (err) {
      alert("Could not fetch book details.");
    }
  };

  window.deleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/v1/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadBooks(); // reload list
      } else {
        alert("Failed to delete book.");
      }
    } catch (err) {
      alert("Error deleting book.");
    }
  };

  // Modal close
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("bookModal").classList.add("hidden");
  });
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("bookModal");
    if (e.target === modal) modal.classList.add("hidden");
  });
});
