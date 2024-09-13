document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("image-track");

  // Initialize dataset values
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = "0";
  track.dataset.percentage = "0";

  const handleOnDown = e => {
      console.log("Mouse down at:", e.clientX); // Debugging
      track.dataset.mouseDownAt = e.clientX;
  };

  const handleOnUp = () => {
      console.log("Mouse up"); // Debugging
      track.dataset.mouseDownAt = "0";
      track.dataset.prevPercentage = track.dataset.percentage;
  };

  const handleOnMove = e => {
      if (track.dataset.mouseDownAt === "0") return;

      const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2;

      // Slower movement for the track
      const trackPercentage = (mouseDelta / maxDelta) * -50; // Reduced by half for slower track movement
      const nextTrackPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + trackPercentage;
      const nextTrackPercentage = Math.max(Math.min(nextTrackPercentageUnconstrained, 0), -100);

      track.dataset.percentage = nextTrackPercentage;

      // Move the track more slowly
      track.style.transform = `translate(${nextTrackPercentage}%, 0)`;

      // Faster movement for the images inside the track
      for (const image of track.getElementsByClassName("image")) {
          const imageSpeedFactor = 2; // Adjust this value to control the image movement speed
          const imagePosition = 50 + nextTrackPercentage * imageSpeedFactor;
          image.style.objectPosition = `${imagePosition}% center`;
      }
  };

  // Attach event listeners
  track.addEventListener("mousedown", handleOnDown);
  window.addEventListener("mouseup", handleOnUp); // Listen on window for mouseup
  window.addEventListener("mousemove", handleOnMove); // Listen on window for mousemove

  // Slider functionality
  let items = document.querySelectorAll(".slider .item");
  let next = document.getElementById("next");
  let prev = document.getElementById("prev");

  let active = Math.min(3, items.length - 1);

  function loadShow() {
      let stt = 0;
      items[active].style.transform = "none";
      items[active].style.zIndex = 1;
      items[active].style.filter = "none";
      items[active].style.opacity = 1;

      for (let i = active + 1; i < items.length; i++) {
          stt++;
          items[i].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
          items[i].style.zIndex = -stt;
          items[i].style.filter = "blur(5px)";
          items[i].style.opacity = stt > 2 ? 0 : 0.6;
      }

      stt = 0;
      for (let i = active - 1; i >= 0; i--) {
          stt++;
          items[i].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
          items[i].style.zIndex = -stt;
          items[i].style.filter = "blur(5px)";
          items[i].style.opacity = stt > 2 ? 0 : 0.6;
      }
  }

  loadShow();

  next.onclick = function() {
      active = active + 1 < items.length ? active + 1 : active;
      loadShow();
  }

  prev.onclick = function() {
      active = active - 1 >= 0 ? active - 1 : active;
      loadShow();
  }
});
