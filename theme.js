const toggleBtn = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");

const themes = ["light", "dark"]; // Add more themes here: "retro", "pastel", etc.
let currentThemeIndex = 0;

toggleBtn.addEventListener("click", () => {
    // Move to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    // Apply theme to <html>
    document.documentElement.setAttribute("data-theme", newTheme);

    // Swap themed images
    heroImage.src = `assets/hero-${newTheme}.svg`;
});
