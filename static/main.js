let showingFavorite = false;

function moveFloatingWindow(floatingWindowId) {
    if (floatingWindowId === "add-new-favorite") {
        document.getElementById('black-blur').style.display = showingFavorite ? "none" : "block";
        document.getElementById('add-new-favorite').style.bottom = showingFavorite ? "100%" : "50%";
        // Now give the transform translateY
        // document.getElementById('add-new-favorite').style.transform = showingFavorite ? "none" : "translateY(-50%)";
        showingFavorite = !showingFavorite;
    }
}