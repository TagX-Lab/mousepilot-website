/**
 * MousePilot by TAGX Labs™ — Bespoke 3D Tactical Cyber Logo Showcase
 * Clean, Human-Crafted 3D Engineering • Zero Particle Clutter • 120 FPS
 */

(function initMousePilot3DScene() {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  function getViewportSize() {
    return {
      width: container.clientWidth || 500,
      height: container.clientHeight || 500,
    };
  }

  let { width, height } = getViewportSize();

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 22);

  // WebGL Renderer Setup (Clean, High-Fidelity)
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    precision: 'highp'
  });
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // Master 3D Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // Volumetric Studio Lighting
  const ambientLight = new THREE.AmbientLight(0x0C181D, 2.8);
  scene.add(ambientLight);

  const aquaLight = new THREE.PointLight(0x8CC7C4, 5.5, 60);
  aquaLight.position.set(14, 12, 16);
  scene.add(aquaLight);

  const crimsonLight = new THREE.PointLight(0xDB1A1A, 4.5, 50);
  crimsonLight.position.set(-14, -10, 14);
  scene.add(crimsonLight);

  const topRimLight = new THREE.PointLight(0x00FFEA, 3.5, 40);
  topRimLight.position.set(0, 18, 10);
  scene.add(topRimLight);

  // =========================================================================
  // 1. 3D TACTICAL CYBER LOGO BADGE & AERODYNAMIC WINGS
  // =========================================================================
  const logoBadgeGroup = new THREE.Group();
  masterGroup.add(logoBadgeGroup);

  // Load High-Resolution Official Logo Texture
  const textureLoader = new THREE.TextureLoader();
  const logoTexture = textureLoader.load('assets/logo.png');
  logoTexture.generateMipmaps = true;
  logoTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // Center 3D Plaque / Shield Geometry
  const badgeWidth = 6.0;
  const badgeHeight = 6.0;
  const badgeRadius = 1.2;
  
  // Create Rounded Shield Shape
  const shieldShape = new THREE.Shape();
  const x = -badgeWidth / 2;
  const y = -badgeHeight / 2;
  shieldShape.moveTo(x + badgeRadius, y);
  shieldShape.lineTo(x + badgeWidth - badgeRadius, y);
  shieldShape.quadraticCurveTo(x + badgeWidth, y, x + badgeWidth, y + badgeRadius);
  shieldShape.lineTo(x + badgeWidth, y + badgeHeight - badgeRadius);
  shieldShape.quadraticCurveTo(x + badgeWidth, y + badgeHeight, x + badgeWidth - badgeRadius, y + badgeHeight);
  shieldShape.lineTo(x + badgeRadius, y + badgeHeight);
  shieldShape.quadraticCurveTo(x, y + badgeHeight, x, y + badgeHeight - badgeRadius);
  shieldShape.lineTo(x, y + badgeRadius);
  shieldShape.quadraticCurveTo(x, y, x + badgeRadius, y);

  // Extruded 3D Badge Body
  const extrudeSettings = {
    depth: 0.6,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.2,
    bevelThickness: 0.2,
  };

  const badgeGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
  badgeGeo.center();

  // Front Face Material with Logo Texture & Metallic Back/Sides
  const badgeFrontMat = new THREE.MeshStandardMaterial({
    map: logoTexture,
    metalness: 0.7,
    roughness: 0.25,
    emissive: 0x143039,
    emissiveIntensity: 0.3,
  });

  const badgeSideMat = new THREE.MeshStandardMaterial({
    color: 0x162d37,
    metalness: 0.9,
    roughness: 0.15,
    emissive: 0x8CC7C4,
    emissiveIntensity: 0.2,
  });

  const badgeMesh = new THREE.Mesh(badgeGeo, [badgeFrontMat, badgeSideMat]);
  logoBadgeGroup.add(badgeMesh);

  // Glowing Outer Bevel Frame
  const frameGeo = new THREE.EdgesGeometry(badgeGeo, 24);
  const frameMat = new THREE.LineBasicMaterial({
    color: 0x8CC7C4,
    linewidth: 2,
    transparent: true,
    opacity: 0.6,
  });
  const frameLines = new THREE.LineSegments(frameGeo, frameMat);
  logoBadgeGroup.add(frameLines);

  // Left & Right Procedural Cyber Wing Blades
  function createCyberWing(isRight = false) {
    const wingShape = new THREE.Shape();
    const dir = isRight ? 1 : -1;

    wingShape.moveTo(0, 0);
    wingShape.lineTo(dir * 3.2, 1.6);
    wingShape.lineTo(dir * 3.8, 1.0);
    wingShape.lineTo(dir * 1.6, -1.6);
    wingShape.lineTo(0, -1.0);
    wingShape.closePath();

    const wingExtrude = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrude);
    wingGeo.center();

    const wingMat = new THREE.MeshStandardMaterial({
      color: isRight ? 0x2C687B : 0xDB1A1A,
      metalness: 0.85,
      roughness: 0.2,
      emissive: isRight ? 0x8CC7C4 : 0xDB1A1A,
      emissiveIntensity: 0.35,
    });

    return new THREE.Mesh(wingGeo, wingMat);
  }

  const leftWing = createCyberWing(false);
  leftWing.position.set(-4.2, 0, -0.15);
  logoBadgeGroup.add(leftWing);

  const rightWing = createCyberWing(true);
  rightWing.position.set(4.2, 0, -0.15);
  logoBadgeGroup.add(rightWing);

  // Floating Holographic Telemetry Rings
  const ring1Geo = new THREE.TorusGeometry(5.8, 0.04, 12, 64);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x8CC7C4,
    transparent: true,
    opacity: 0.4,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  logoBadgeGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(7.0, 0.03, 12, 64);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xDB1A1A,
    transparent: true,
    opacity: 0.3,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 3.2;
  logoBadgeGroup.add(ring2);

  // 4 Orbiting Satellites
  const beaconCount = 4;
  const beacons = [];
  const beaconGeo = new THREE.ConeGeometry(0.22, 0.6, 4);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00FFEA });

  for (let i = 0; i < beaconCount; i++) {
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    logoBadgeGroup.add(beacon);
    beacons.push(beacon);
  }

  // =========================================================================
  // 2. INTERACTIVE CURSOR TILT & RESIZE
  // =========================================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    const halfX = window.innerWidth / 2;
    const halfY = window.innerHeight / 2;
    mouseX = (e.clientX - halfX) / halfX;
    mouseY = (e.clientY - halfY) / halfY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (e.touches[0].clientX - halfX) / halfX;
      mouseY = (e.touches[0].clientY - halfY) / halfY;
    }
  }, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const size = getViewportSize();
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    }, 100);
  }, { passive: true });

  // =========================================================================
  // 3. 120 FPS ANIMATION LOOP
  // =========================================================================
  let isHeroVisible = true;
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0.01 });
    observer.observe(heroSection);
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isHeroVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Damping Mouse Tilt
    targetX += (mouseX * 0.45 - targetX) * 0.06;
    targetY += (mouseY * 0.35 - targetY) * 0.06;

    masterGroup.rotation.y = targetX * 0.5;
    masterGroup.rotation.x = -targetY * 0.35;

    // Sinusoidal Float
    logoBadgeGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.4;
    logoBadgeGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.12;

    // Holographic Telemetry Rings
    ring1.rotation.z = elapsedTime * 0.5;
    ring2.rotation.y = elapsedTime * 0.4;

    // Orbiting Satellites
    for (let i = 0; i < beaconCount; i++) {
      const angle = elapsedTime * 1.1 + (i * Math.PI * 2) / beaconCount;
      beacons[i].position.set(Math.cos(angle) * 5.8, Math.sin(angle) * 5.8, 0);
      beacons[i].rotation.z = angle - Math.PI / 2;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
