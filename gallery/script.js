document.addEventListener("DOMContentLoaded", function () {
  var images = document.querySelectorAll(".gallery > img");
  images.forEach(function (img) {
    // Existing mouseover and mouseout event listeners
    img.addEventListener("mouseover", function (e) {
      var filename = this.src.split("/").pop();
      var dimensions = this.naturalWidth + "x" + this.naturalHeight;
      var tooltipContent = filename + " - " + dimensions;

      var tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = tooltipContent;
      this.parentNode.appendChild(tooltip);

      var rect = this.getBoundingClientRect();
      var tooltipWidth = tooltip.offsetWidth;
      var leftPosition = rect.left + rect.width / 4;

      tooltip.style.left = leftPosition + "px";
      tooltip.style.top = rect.bottom + 10 + "px";
      tooltip.style.display = "block";
    });

    img.addEventListener("mouseout", function () {
      var tooltip = this.parentNode.querySelector(".tooltip");
      if (tooltip) tooltip.remove();
    });
  });
});
