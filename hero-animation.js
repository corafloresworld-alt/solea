(() => {
  const hero = document.querySelector('[data-hero-animation]');
  if (!hero) return;

  const stage = hero.querySelector('[data-hero-stage]');
  const brand = hero.querySelector('.hero-animation__brand');
  const product = hero.querySelector('.hero-animation__product');
  if (!stage || !brand || !product) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INITIAL_SCALE = 0.32;
  let framePending = false;
  let animationMetrics = null;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  function measureAnimation() {
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const productWidth = product.offsetWidth;
    const productHeight = product.offsetHeight;
    if (!stageWidth || !stageHeight || !productWidth || !productHeight) return null;

    const isMobile = window.matchMedia('(max-width: 560px)').matches;
    const maxWidth = stageWidth * (isMobile ? 0.96 : 0.88);
    const maxHeight = stageHeight * (isMobile ? 0.86 : 0.90);
    const maxScale = Math.max(
      INITIAL_SCALE,
      Math.min(1.3, maxWidth / productWidth, maxHeight / productHeight),
    );
    const initialOffset = window.innerHeight * 0.78;
    const growthDistance = initialOffset;
    const exitDistance = (stageHeight + productHeight * maxScale) / 2 + 14;
    const travel = growthDistance + exitDistance;

    hero.style.setProperty('--hero-scroll-distance', `${travel}px`);
    animationMetrics = { maxScale, initialOffset, growthDistance, exitDistance, travel };
    return animationMetrics;
  }

  function updateAnimation() {
    framePending = false;
    if (reducedMotion.matches) return;

    const metrics = animationMetrics || measureAnimation();
    if (!metrics) return;

    const heroTop = hero.getBoundingClientRect().top + window.scrollY;
    const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0;
    const start = heroTop - stickyTop;
    const progress = clamp((window.scrollY - start) / metrics.travel);
    const growProgress = clamp((progress * metrics.travel) / metrics.growthDistance);
    const exitProgress = clamp(
      (progress * metrics.travel - metrics.growthDistance) / metrics.exitDistance,
    );

    let scale = metrics.maxScale;
    let translateY = -metrics.exitDistance * exitProgress;

    if (progress * metrics.travel <= metrics.growthDistance) {
      const easedGrowth = easeOutCubic(growProgress);
      scale = INITIAL_SCALE + (metrics.maxScale - INITIAL_SCALE) * easedGrowth;
      translateY = metrics.initialOffset * (1 - growProgress);
    }

    product.style.setProperty('--hero-scale', scale.toFixed(4));
    product.style.setProperty('--hero-translate-y', `${translateY.toFixed(2)}px`);
    product.style.setProperty('--hero-opacity', Math.min(1, progress * 2.5).toFixed(3));

    const productRect = product.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    const fadeDistance = Math.max(18, Math.min(48, stage.clientHeight * 0.06));
    let brandOpacity = 0;

    if (productRect.bottom <= brandRect.top) {
      brandOpacity = clamp((brandRect.top - productRect.bottom) / fadeDistance);
    } else if (productRect.top >= brandRect.bottom) {
      brandOpacity = clamp((productRect.top - brandRect.bottom) / fadeDistance);
    }

    brand.style.opacity = brandOpacity.toFixed(3);
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateAnimation);
  }

  function syncMotionPreference() {
    hero.classList.toggle('hero-animation--enhanced', !reducedMotion.matches);
    if (reducedMotion.matches) {
      hero.style.removeProperty('--hero-scroll-distance');
      brand.style.removeProperty('opacity');
      animationMetrics = null;
    } else {
      measureAnimation();
    }
    scheduleUpdate();
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', () => {
    animationMetrics = measureAnimation();
    scheduleUpdate();
  }, { passive: true });
  product.addEventListener('load', () => {
    animationMetrics = measureAnimation();
    scheduleUpdate();
  }, { once: true });
  reducedMotion.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
})();
