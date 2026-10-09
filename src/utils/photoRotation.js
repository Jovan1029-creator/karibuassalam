// Schedule one change. React owns the current photo and restarts this after a
// successful change. Cancellation also covers an in-flight download/decode.
export function schedulePhotoChange({
  photos, index, onReady, delay = 7000,
  createImage = () => new Image(),
  schedule = setTimeout, cancel = clearTimeout,
}) {
  if (photos.length < 2) return () => {};
  let stopped = false;
  let preload;
  let attempted = 0;
  let timer = schedule(loadNext, delay);

  function loadNext() {
    const next = (index + ++attempted) % photos.length;
    preload = createImage();
    const image = preload;
    const skip = () => {
      if (!stopped && attempted < photos.length - 1) timer = schedule(loadNext, delay);
    };
    image.onload = async () => {
      try {
        if (image.decode) await image.decode();
        if (!stopped) onReady(next);
      } catch {
        skip(); // Keep the current image if the next cannot be displayed.
      }
    };
    image.onerror = skip;
    image.src = photos[next].image;
  }

  return () => {
    stopped = true;
    cancel(timer);
    if (preload) {
      preload.onload = null;
      preload.onerror = null;
      preload.src = "";
    }
  };
}
