document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const errorMsg = document.getElementById("error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous errors
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
    document
      .querySelectorAll(".field-error")
      .forEach((el) => (el.textContent = ""));

    const name = form.name.value.trim();
    const mobile = form.mobile.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // Client-side validation
    let hasError = false;

    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      document.getElementById("mobile-error").textContent =
        "Mobile must be 10 digits";
      hasError = true;
    }

    if (password.length < 8) {
      document.getElementById("password-error").textContent =
        "Password must be at least 8 characters";
      hasError = true;
    }

    if (hasError) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Signing up...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, mobile, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful signup, redirect to user home
        window.location.href = "/user/home";
      } else {
        // Show error message
        errorMsg.textContent =
          data.message || "An error occurred during signup.";
        errorMsg.classList.remove("hidden");
      }
    } catch (err) {
      errorMsg.textContent = "Network error. Please try again later.";
      errorMsg.classList.remove("hidden");
    } finally {
      submitBtn.textContent = "Sign Up";
      submitBtn.disabled = false;
    }
  });
});
