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

  cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const dotGeometry = new THREE.SphereGeometry(0.03, 6, 6);

  const baseSize = 2;
  let clickCount = 0;
  const placed = new Set();

  const faceCubes = [];
  const cornerCubes = [];

  function makeKey(x, y, z, s) {
    return `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)},${s.toFixed(3)}`;
  }

  function createCube(x, y, z, size = 1) {
    const key = makeKey(x, y, z, size);
    if (placed.has(key)) return null;
    placed.add(key);

    const geo = new THREE.BoxGeometry(size, size, size);
    const mesh = new THREE.Mesh(geo, cubeMaterial);
    const edges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(wireframe);
    mesh.position.set(x, y, z);
    mesh.scale.set(0, 0, 0);
    root.add(mesh);

    new TWEEN.Tween(mesh.scale)
      .to({ x: 1, y: 1, z: 1 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

    const verts = geo.attributes.position.array;
    for (let i = 0; i < verts.length; i += 3) {
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(verts[i], verts[i + 1], verts[i + 2]);
      mesh.add(dot);
    }

    return mesh;
  }

  function removeCubes(cubeArray) {
    cubeArray.forEach(cube => {
      new TWEEN.Tween(cube.scale)
        .to({ x: 0, y: 0, z: 0 }, 400)
        .easing(TWEEN.Easing.Quadratic.In)
        .onComplete(() => {
          root.remove(cube);
        })
        .start();
    });
    cubeArray.length = 0;
  }

  // === STEP-BY-STEP STARTUP ANIMATION ===
    const mainCube = createCube(0, 0, 0, baseSize);

  setTimeout(() => {
    const dirs = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ];
    for (let [dx, dy, dz] of dirs) {
      const faceCubeSize = 1.;
      const cube = createCube(dx * faceCubeSize, dy * faceCubeSize, dz * faceCubeSize, faceCubeSize);
      if (cube) faceCubes.push(cube);
    }
    clickCount++; // simulate stage 1

    setTimeout(() => {
      const cornerOffsets = [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      ];
      faceCubes.forEach(parent => {
        const pos = parent.position;
        for (let [dx, dy, dz] of cornerOffsets) {
          const x = pos.x + dx * 0.5;
          const y = pos.y + dy * 0.5;
          const z = pos.z + dz * 0.5;
          const cube = createCube(x, y, z, 0.5);
          if (cube) cornerCubes.push(cube);
        }
      });
      clickCount++; // simulate stage 2
    }, 1000);
  }, 1000);

  // === CLICK-BASED LOOP ===
  canvas.addEventListener("click", () => {
    const cycle = clickCount % 4;

    if (cycle === 0) {
      const dirs = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1],
      ];
      for (let [dx, dy, dz] of dirs) {
        const faceCubeSize = 1.;
        const cube = createCube(dx * faceCubeSize, dy * faceCubeSize, dz * faceCubeSize, faceCubeSize);
        if (cube) faceCubes.push(cube);
      }
    }

    else if (cycle === 1) {
      const cornerOffsets = [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      ];
      faceCubes.forEach(parent => {
        const pos = parent.position;
        for (let [dx, dy, dz] of cornerOffsets) {
          const x = pos.x + dx * 0.5;
          const y = pos.y + dy * 0.5;
          const z = pos.z + dz * 0.5;
          const cube = createCube(x, y, z, 0.5);
          if (cube) cornerCubes.push(cube);
        }
      });
    }

    else if (cycle === 2) {
      removeCubes(cornerCubes);
    }

    else if (cycle === 3) {
      removeCubes(faceCubes);
      placed.clear();
      placed.add(makeKey(0, 0, 0, baseSize));
    }

    clickCount++;
  });

  // === ROTATION ===
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
