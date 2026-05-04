document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous errors
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";

    const email = form.email.value.trim();
    const password = form.password.value;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login, redirect to user home
        window.location.href = "/user/home";
      } else {
        // Show error message
        errorMsg.textContent = data.message || "Invalid email or password.";
        errorMsg.classList.remove("hidden");
      }
    } catch (err) {
      errorMsg.textContent = "Network error. Please try again later.";
      errorMsg.classList.remove("hidden");
    } finally {
      submitBtn.textContent = "Log In";
      submitBtn.disabled = false;
    }
  });
});
