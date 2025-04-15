import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

// === REALISTIC HEXASTIX ===
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setTheme(mode) {
    if (mode === "light") {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      themeIcon.src = "../assets/icons/moon-icon.png";
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      themeIcon.src = "../assets/icons/sun-icon.png";
      localStorage.setItem("theme", "dark");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  // === THREE.JS SETUP ===
  const canvas = document.getElementById("three-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  const root = new THREE.Group();
  scene.add(root);

  const rodLength = 10;
  const rodRadius = 0.12;
  const pencilColor = 0xf4a300; // pencil yellow-orange

  const rodGeometry = new THREE.CylinderGeometry(rodRadius, rodRadius, rodLength, 12);

  const pencilMaterial = new THREE.MeshStandardMaterial({ color: pencilColor });

  const count = 24;
  const radius = 2.4;

  function addPencils(directionVec, axis) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const pencil = new THREE.Mesh(rodGeometry, pencilMaterial);

      // Direction-based orientation and position
      if (axis === 'x') {
        pencil.rotation.z = Math.PI / 2;
        pencil.position.set(0, x, y);
      } else if (axis === 'y') {
        pencil.position.set(x, 0, y);
      } else if (axis === 'z') {
        pencil.rotation.x = Math.PI / 2;
        pencil.position.set(x, y, 0);
      }

      root.add(pencil);
    }
  }

  addPencils(new THREE.Vector3(1, 0, 0), 'x');
  addPencils(new THREE.Vector3(0, 1, 0), 'y');
  addPencils(new THREE.Vector3(0, 0, 1), 'z');

  // === MOUSE ROTATION ===
  const mouse = { x: 0, y: 0 };
  document.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
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
