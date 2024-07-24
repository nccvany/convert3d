import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";

const loaders = async (extension) => {
  let loader, data;
  switch (extension) {
    case "glb":
      loader = new GLTFLoader();
      return loader;
    case "gltf":
      loader = new GLTFLoader();
      return loader;
    case "stl":
      loader = new STLLoader();
      return loader;
    case "obj":
      loader = new OBJLoader();
      return loader;
    case "ply":
      loader = new PLYLoader();
      return loader;
    default:
      console.log("Unsupported Input Format");
      throw new Error("Unsupported Input Format");
  }
};

async function captureImageFromModel(modelPath, outputFileName) {
  // Create the scene
  const scene = new THREE.Scene();

  // Set the background color to white
  scene.background = new THREE.Color(0xffffff);

  // Create the camera
  const camera = new THREE.PerspectiveCamera(
    120,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3); // Adjusted camera position

  // Create the renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // // Add the renderer's DOM element to the document
  document.body.appendChild(renderer.domElement);

  // Add lights to the scene
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 100, 100).normalize();
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Additional ambient light
  scene.add(ambientLight);

  // Load the 3D model
  const inputFormat = modelPath.lastIndexOf(".");
  const extension = modelPath.substring(inputFormat + 1);

  let loader;
  if (extension === "stl") {
    loader = new STLLoader();
  } else if (extension === "glb") {
    loader = new GLTFLoader();
  } else if (extension === "obj") {
    loader = new OBJLoader();
  } else if (extension === "ply") {
    loader = new PLYLoader();
  }
  
  loader.load(
    modelPath,
    (geometry) => {
      let mesh;
      if (extension === "stl" || extension === "ply") {
        const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
        mesh = new THREE.Mesh(geometry, material);
      } else if (extension === "glb") {
        mesh = geometry.scene;
      } else if (extension === "obj") {
        mesh = geometry;
      }

      mesh.scale.set(1, 1, 1); // Adjust scale if needed
      mesh.position.set(0, 0, 0); // Adjust position if needed
      scene.add(mesh);

      // Render the scene
      renderer.render(scene, camera);

      // Capture the image
      const captureImage = async () => {
        renderer.render(scene, camera);

        // Get the data URL of the canvas content
        const dataURL = renderer.domElement.toDataURL("image/png");

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = outputFileName;
        link.textContent = "Download Image";
        document.body.appendChild(link);
        link.click();
      };

      // // Capture the image after a short delay to ensure everything is rendered
      // setTimeout(captureImage, 1000);
      captureImage();
    },
    undefined,
    (error) => {
      console.error("An error happened:", error);
    }
  );
}

// Example usage
captureImageFromModel("./models/converted-model.ply", "model-screenshot.png");
