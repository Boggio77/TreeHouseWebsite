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
      const imageSpeedFactor = 2; // Change this value to adjust how much faster the images move compared to the track
      const imagePosition = 100 + nextTrackPercentage * imageSpeedFactor;
      image.style.objectPosition = `${imagePosition}% center`;
    }
  };
  
  // Attach event listeners
  track.addEventListener("mousedown", handleOnDown);
  window.addEventListener("mouseup", handleOnUp); // Listen on window for mouseup
  window.addEventListener("mousemove", handleOnMove); // Listen on window for mousemove
});
