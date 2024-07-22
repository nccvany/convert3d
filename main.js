import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";
import { PLYExporter } from "three/addons/exporters/PLYExporter.js";
import * as THREE from "three";
import { downloadFile } from "./utils/downloadFile";

const loader = async (extension,input) =>{
  let loader,data;
  const scene = new THREE.Scene();
  switch (extension) {
    case "glb":
      loader = new GLTFLoader();
      data = await loader.loadAsync(input);
      console.log("data", data);
      return data
    case "gltf":
      loader = new GLTFLoader();
      data = await loader.loadAsync(input);
      console.log("data", data);
      return data;
    case "stl":
      loader = new STLLoader();
      data = await loader.loadAsync(input);
      data = new THREE.Mesh(data, new THREE.MeshStandardMaterial());
      console.log("data", data);
      return data;
    case "obj":
      loader = new OBJLoader();
      data = await loader.loadAsync(input);
      scene.add(data);
      data = scene;
      console.log("data", data);
      return data;
    case "ply":
      loader = new PLYLoader();
      data = await loader.loadAsync(input);
      data = new THREE.Mesh(data, new THREE.MeshStandardMaterial());
      console.log("data", data);
      return data;
    default:
      console.log("Unsupported Input Format");
      throw new Error('Unsupported Input Format')
  }
}

const exporter = async (outputFormat,data) =>{
  let exporter,result;
  switch (outputFormat) {
    case "glb":
      exporter = new GLTFExporter();
      result = exporter.parse(data, (result) => {
        const jsonString = JSON.stringify(result);
        downloadFile(jsonString, "converted-model.glb");
      });
      break;
    case "gltf":
      exporter = new GLTFExporter();
      result = exporter.parse(scene);
      console.log("output", result);
      downloadFile(result, "converted-model.gltf");
      break;
    case "stl":
      exporter = new STLExporter();
      result = exporter.parse(data.scene || data);
      console.log("output", result);
      downloadFile(result, "converted-model.stl");
      break;
    case "obj":
      exporter = new OBJExporter();
      result = exporter.parse(data.scene || data);
      console.log("output", result);
      downloadFile(result, "converted-model.obj");
      break;
    case "ply":
      exporter = new PLYExporter();
      const scene = new THREE.Scene();
      if (data.scene) {
        scene.add(data.scene);
      } else {
        scene.add(data);
      }
      result = exporter.parse(scene);
      console.log("output", result);
      downloadFile(result, "converted-model.ply");
      break;
    default:
      console.log("Unsupported Output Format");
  }
}

const convertFromat = async (input, outputFormat) => {
  const inputFormat = input.lastIndexOf(".");
  const extension = input.substring(inputFormat + 1);
  console.log(extension);
  const data = await loader(extension,input);
  await exporter(outputFormat,data); 
};

convertFromat("./models/damaged-helmet.stl", "glb");
