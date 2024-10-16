document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("#container-projecte img, #container-projecte .galeria img");
    const popupOverlay = document.getElementById("popup-overlay");
    const popupImage = document.getElementById("popup-image");

    images.forEach(image => {
        image.addEventListener("click", () => {
            popupImage.src = image.src;
            popupOverlay.classList.add("active");
        });
    });

    popupOverlay.addEventListener("click", () => {
        popupOverlay.classList.remove("active");
    });
});
