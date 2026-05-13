export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;

  // 1. Check for touch capability
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // 2. Check for small screen width (standard for mobile)
  const isSmallScreen = window.innerWidth <= 768;

  // 3. User Agent fallback (the "legacy" way)
  const isUA = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // If it has touch AND is small screen, OR it's a mobile UA, it's mobile.
  return (hasTouch && isSmallScreen) || isUA;
};
