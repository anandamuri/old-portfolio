import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

let cubeMaterial, dotMaterial, lineMaterial;

const materials = {
  dark: {
    cube: new THREE.MeshStandardMaterial({ color: 0x000000 }),
    dot: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    line: new THREE.LineBasicMaterial({ color: 0xffffff })
  },
  light: {
    cube: new THREE.MeshStandardMaterial({ color: 0xffffff }),
    dot: new THREE.MeshBasicMaterial({ color: 0x000000 }),
    line: new THREE.LineBasicMaterial({ color: 0x000000 })
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setTheme(mode) {
    document.body.classList.toggle("dark-mode", mode === "dark");
    document.body.classList.toggle("light-mode", mode === "light");
    themeIcon.src = mode === "light"
      ? "../assets/icons/moon-icon.png"
      : "../assets/icons/sun-icon.png";
    const logoImg = document.getElementById("logo-img");
    if (logoImg) {
      logoImg.src = mode === "light"
        ? "../assets/icons/my-logo-light.png"
        : "../assets/icons/my-logo-dark.png";
    }
    localStorage.setItem("theme", mode);
  }

  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  setTheme(localStorage.getItem("theme") || "dark");

  const canvas = document.getElementById("three-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  const root = new THREE.Group();
  scene.add(root);

  cubeMaterial = materials.dark.cube;
  dotMaterial = materials.dark.dot;
  lineMaterial = materials.dark.line;
  const dotGeometry = new THREE.SphereGeometry(0.03, 6, 6);

  const placed = new Set();

  function makeKey(x, y, z, s) {
    return `${x},${y},${z},${s}`;
  }

  function createCube(x, y, z, size = 1) {
    const key = makeKey(x, y, z, size);
    if (placed.has(key)) return;
    placed.add(key);

    const geo = new THREE.BoxGeometry(size, size, size);
    const mesh = new THREE.Mesh(geo, cubeMaterial);

    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      lineMaterial
    );
    mesh.add(wire);
    mesh.position.set(x, y, z);
    mesh.scale.set(0, 0, 0);

    const verts = geo.attributes.position.array;
    for (let i = 0; i < verts.length; i += 3) {
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(verts[i], verts[i + 1], verts[i + 2]);
      mesh.add(dot);
    }

    root.add(mesh);
    new TWEEN.Tween(mesh.scale)
      .to({ x: 1, y: 1, z: 1 }, 1200)
      .easing(TWEEN.Easing.Elastic.Out)
      .delay(Math.random() * 800)
      .start();
  }

  // === Generate a compact random cluster like 8VC ===
  const cubeCount = 25;
  const radius = 2;

  for (let i = 0; i < cubeCount; i++) {
    const x = (Math.random() - 0.5) * radius * 2;
    const y = (Math.random() - 0.5) * radius * 2;
    const z = (Math.random() - 0.5) * radius * 2;
    createCube(x, y, z, 1);
  }

  // === Mouse Rotation ===
  const mouse = { x: 0, y: 0 };
  document.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    root.rotation.x += (mouse.y * 0.3 - root.rotation.x) * 0.05;
    root.rotation.y += (mouse.x * 0.3 - root.rotation.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
});
