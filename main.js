import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";

function downloadOBJ(result) {
  var blob = new Blob([result], { type: "text/plain" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "14mb.obj";
  link.click();
}

const main = async () => {
  const loader = new GLTFLoader();
  const data = await loader.loadAsync("14mb.glb");
  console.log("data", data);

  const objExporter = new OBJExporter();
  const obj = objExporter.parse(data.scene);
  console.log("obj", obj);
  downloadOBJ(obj);
};

main();
