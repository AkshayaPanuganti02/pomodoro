// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#" || targetId.length < 2) {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Full audio credits modal
const creditsOverlay = document.getElementById("creditsOverlay");
const viewFullCreditsButton = document.getElementById("viewFullCreditsButton");
const closeCreditsButton = document.getElementById("closeCreditsButton");

viewFullCreditsButton.addEventListener("click", function() {
    creditsOverlay.classList.add("open");
});

closeCreditsButton.addEventListener("click", function() {
    creditsOverlay.classList.remove("open");
});

creditsOverlay.addEventListener("click", function(event) {
    if (event.target === creditsOverlay) {
        creditsOverlay.classList.remove("open");
    }
});

// Privacy / About are placeholders until those pages exist
document.getElementById("privacyLink").addEventListener("click", function(event) {
    event.preventDefault();
    alert("Privacy page coming soon.");
});

document.getElementById("aboutLink").addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
});
