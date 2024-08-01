import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Navbar from "./components/ui/NavBar";

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Light
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(1, 2, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // the following cubes are just for refernce
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.set(0, 30, 10);
    const cube3 = new THREE.Mesh(geometry, material);
    cube3.position.set(0, 30, -10);
    const cube4 = new THREE.Mesh(geometry, material);
    cube4.position.set(0, 80, -25);
    const cube5 = new THREE.Mesh(geometry, material);
    cube5.position.set(0, 80, -45);
    scene.add(cube2, cube3, cube4, cube5);

    //Load moon Texture
    const textureLoader = new THREE.TextureLoader();
    const moon = textureLoader.load("/moon-dynamic-clay.png"); // Ensure the image is in the public folder or provide the correct path

    // Create a plane and apply the texture
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: moon });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(6, 12, -15);
    scene.add(plane);

    //plane for the bottom of segment-1
    const planeSoildGeometry = new THREE.BoxGeometry(20, 0.5, 20, 20, 2, 20);
    const planeSoildWireframe = new THREE.WireframeGeometry(planeSoildGeometry);

    const planeSoildLine = new THREE.LineSegments(planeSoildWireframe);
    const planSoildMaterial = planeSoildLine.material as THREE.Material;
    planSoildMaterial.depthTest = false;
    planSoildMaterial.opacity = 0.6;
    planSoildMaterial.transparent = true;
    planeSoildLine.position.set(0, -1.5, 5);
    //planeSoild.rotation.x = 90;
    scene.add(planeSoildLine);

    // //This loads a platform
    // const platformLoader = new GLTFLoader();
    // platformLoader.load(
    //   "WireframePlatform.glb",
    //   function (gltf: { scene: THREE.Object3D<THREE.Object3DEventMap> }) {
    //     gltf.scene.position.set(0, -1.8, 5);
    //     gltf.scene.scale.set(10, 5, 15);
    //     scene.add(gltf.scene);
    //   },
    //   undefined,
    //   function (error: ErrorEvent) {
    //     console.error(error);
    //   }
    // );

    // the below code is for the wireframe
    const Sphere = new THREE.SphereGeometry(1, 1, 1);

    const wireframe = new THREE.WireframeGeometry(Sphere);

    const line = new THREE.LineSegments(wireframe);
    const lineMaterial = line.material as THREE.Material;
    lineMaterial.depthTest = false;
    lineMaterial.opacity = 0.25;
    lineMaterial.transparent = true;
    line.position.set(-5, 5, -5);
    scene.add(line);

    const line2 = new THREE.LineSegments(wireframe);
    const lineMaterial2 = line2.material as THREE.Material;
    lineMaterial2.depthTest = false;
    lineMaterial2.opacity = 0.25;
    lineMaterial2.transparent = true;
    line2.position.set(-5, 25, 0);
    scene.add(line2);

    const astroidGeomertry = new THREE.SphereGeometry(0.5);
    const astroidMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const astroid = new THREE.Mesh(astroidGeomertry, astroidMaterial);
    astroid.position.set(5, 80, -70);
    scene.add(astroid);

    //making a box
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxWireframe = new THREE.WireframeGeometry(boxGeometry);

    const boxLine = new THREE.LineSegments(boxWireframe);
    const boxMateral = boxLine.material as THREE.Material;
    boxMateral.depthTest = false;
    boxMateral.opacity = 0.5;
    boxMateral.transparent = true;
    boxLine.position.set(6, 12, -15);
    scene.add(boxLine);

    const boxGeometry2 = new THREE.BoxGeometry(2, 2, 2);
    const boxWireframe2 = new THREE.WireframeGeometry(boxGeometry2);
    const boxLine2 = new THREE.LineSegments(boxWireframe2);
    const boxMateral2 = boxLine.material as THREE.Material;
    boxMateral2.depthTest = false;
    boxMateral2.opacity = 0.4;
    boxMateral2.transparent = true;
    boxLine2.position.set(6, 34, -20);
    scene.add(boxLine2);

    // const loader = new GLTFLoader();
    // let model: THREE.Object3D<THREE.Object3DEventMap>;

    // // Load the GLTF model
    // loader.load(
    //   "/smoothCube.glb",
    //   function (gltf: { scene: THREE.Object3D<THREE.Object3DEventMap> }) {
    //     model = gltf.scene;

    //     // Set the position of the entire model
    //     model.position.set(6, 12, -15); // Example coordinates: x = 1, y = 2, z = 3

    //     scene.add(model);

    //     model.traverse((child) => {
    //       if ((child as THREE.Mesh).isMesh) {
    //         (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
    //           color: 0xffffff,
    //           wireframe: true,
    //         });
    //       }
    //     });
    //   },
    //   undefined,
    //   function (error: ErrorEvent) {
    //     console.error(error);
    //   }
    // );

    // Generate Asteroid Belt
    const generateAsteroidBelt = (scene: THREE.Scene) => {
      const asteroidCount = 300;
      const centerX = 5;
      const centerY = 65;
      const centerZ = -40;
      const radius = 40;

      const asteroids: {
        mesh: THREE.Mesh;
        speed: number;
        direction: number;
      }[] = [];

      const asteroidGeometry = new THREE.DodecahedronGeometry(0.5, 0);
      const asteroidMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
      });

      for (let i = 0; i < asteroidCount; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const z = centerZ + radius * Math.sin(angle);
        const y = centerY + (Math.random() - 0.5) * 5; // Spread in Y-axis

        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set(x, y, z);

        const speed = 0.005 + Math.random() * 0.02;
        const direction = Math.random() < 0.5 ? 1 : -1; // Random direction

        asteroids.push({ mesh: asteroid, speed, direction });
        scene.add(asteroid);
      }

      return asteroids;
    };

    const asteroids = generateAsteroidBelt(scene);

    // Generate random positions for stars
    const generateRandomPosition = (range: number) => {
      return (Math.random() - 0.5) * range;
    };

    // Generate stars with z in range 100-200
    for (let i = 0; i < 600; i++) {
      const x = generateRandomPosition(400);
      const y = generateRandomPosition(400);
      const z = generateRandomPosition(400);
      //const z = Math.random() * 100 - 200; // z-axis between 100 and 200
      const starGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(x, y, z);
      scene.add(star);
    }

    // Animation loop
    let lineDirectionX = 0.01;
    let lineDirectionY = 0.01;
    let lineDirectionX2 = 0.01;
    let lineDirectionY2 = 0.01;

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      boxLine.rotation.z -= 0.005;
      boxLine.rotation.y -= 0.005;

      // Move the line diagonally
      line.position.x += lineDirectionX;
      line.position.y -= lineDirectionY;
      line.rotation.z -= 0.01;
      line.rotation.x += 0.01;

      // Reverse direction if line reaches bounds
      if (line.position.x > 5 || line.position.x < -5) {
        lineDirectionX = -lineDirectionX;
      }
      if (line.position.y > 5 || line.position.y < -5) {
        lineDirectionY = -lineDirectionY;
      }

      // Move the line diagonally
      line2.position.x += lineDirectionX2;
      line2.position.y -= lineDirectionY2;
      line2.rotation.z -= 0.01;
      line2.rotation.x += 0.01;

      // Reverse direction if line reaches bounds
      if (line2.position.x > 5 || line2.position.x < -5) {
        lineDirectionX2 = -lineDirectionX2;
      }
      if (line2.position.y > 30 || line2.position.y < 20) {
        lineDirectionY2 = -lineDirectionY2;
      }

      // Animate the asteroid belt
      // Update asteroid belt
      asteroids.forEach((asteroidData) => {
        const { mesh, speed, direction } = asteroidData;
        const angle = speed * direction;
        mesh.position.x =
          2 +
          Math.cos(angle) * (mesh.position.x - 2) -
          Math.sin(angle) * (mesh.position.z + 10);
        mesh.position.z =
          -10 +
          Math.sin(angle) * (mesh.position.x - 2) +
          Math.cos(angle) * (mesh.position.z + 10);
      });

      boxLine2.rotation.y -= 0.005;
      //model.rotation.y -= 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Scroll Animation
    const moveCamera = () => {
      if (cameraRef.current) {
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const normalizedScroll = Math.min(
          Math.max(scrollTop / maxScroll, 0),
          1
        );

        let z = 5;
        let y = 0;
        let r = 0;

        if (normalizedScroll <= 0.2) {
          // Move camera from z = 5 to z = 20
          z = 5 + normalizedScroll * 75;
        } else if (normalizedScroll <= 0.4) {
          // Move camera down from y = 0 to y = 30
          z = 20;
          y = 30 * (normalizedScroll - 0.2) * 5;
          r = 5 * (normalizedScroll - 0.2) * 6.35;
        } else if (normalizedScroll <= 0.6) {
          // Move camera from z = 20 to z = -10
          z = 20 - (normalizedScroll - 0.4) * 150;
          y = 30;
        } else if (normalizedScroll <= 0.8) {
          // Move camera down from y = 30 to y = 60
          z = -10;
          y = 30 + (normalizedScroll - 0.6) * 250;
        } else {
          // Move camera from z = -10 to z = -40
          z = -10 - (normalizedScroll - 0.8) * 150;
          y = 80;
        }

        cameraRef.current.position.z = z;
        cameraRef.current.position.y = y;
        cameraRef.current.rotation.y = r;
      }
    };

    window.addEventListener("scroll", moveCamera);

    // Handle window resize
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", moveCamera);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mountRef} className="fixed top-0 left-0 h-screen w-full z-10" />
      <div className="absolute top-0 left-0 h-[500vh] w-full bg-transparent z-20">
        <Navbar />
        <div className="h-screen flex items-center justify-center text-white text-2xl">
          <p>Segment 1: Camera moving from z=5 to z=20</p>
        </div>
        <div className="h-screen flex items-center justify-center text-white text-2xl">
          <p>Segment 2: Camera moving down from y=0 to y=-15</p>
        </div>
        <div className="h-screen flex items-center justify-center text-white text-2xl">
          <p>Segment 3: Camera moving from z=20 to z=-10</p>
        </div>
        <div className="h-screen flex items-center justify-center text-white text-2xl">
          <p>Segment 4: Camera moving down from y=-15 to y=-30</p>
        </div>
        <div className="h-screen flex justify-center text-white text-2xl">
          <p>
            Segment 5: Camera moving from z=-10 to z=-40 Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Voluptas, nihil. Similique
            nostrum aperiam, fuga accusamus asperiores temporibus eveniet
            commodi rerum iusto quis praesentium deleniti aliquid sapiente
            voluptatum aut dignissimos eum repellat? Debitis nostrum a sed,
            facere et corrupti laborum cum rerum officiis, soluta laboriosam,
            aspernatur neque quod! Itaque, unde expedita!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;
