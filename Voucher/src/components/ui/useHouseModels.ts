import * as THREE from "three";
import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const storage = getStorage();

const fetchModelUrl = async (modelPath: string): Promise<string> => {
  const modelRef = ref(storage, modelPath);
  const url = await getDownloadURL(modelRef);
  console.log(`Fetched URL for ${modelPath}: ${url}`);
  return url;
};

export const useHouseModels = () => {
  const [smallHouseModel, setSmallHouseModel] = useState<THREE.Group | null>(null);
  const [mediumHouseModel, setMediumHouseModel] = useState<THREE.Group | null>(null);
  const [largeHouseModel, setLargeHouseModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const loader = new GLTFLoader();

      try {
        const smallModelUrl = await fetchModelUrl("models/cube.glb");
        const mediumModelUrl = await fetchModelUrl("models/cubeMedium.glb");
        const largeModelUrl = await fetchModelUrl("models/cubeLarge.glb");

        console.log("Loading small model from:", smallModelUrl);
        loader.load(smallModelUrl, (gltf: { scene: React.SetStateAction<THREE.Group<THREE.Object3DEventMap> | null>; }) => {
          setSmallHouseModel(gltf.scene);
          console.log("Loaded small model:", gltf.scene);
        });

        console.log("Loading medium model from:", mediumModelUrl);
        loader.load(mediumModelUrl, (gltf: { scene: React.SetStateAction<THREE.Group<THREE.Object3DEventMap> | null>; }) => {
          setMediumHouseModel(gltf.scene);
          console.log("Loaded medium model:", gltf.scene);
        });

        console.log("Loading large model from:", largeModelUrl);
        loader.load(largeModelUrl, (gltf: { scene: React.SetStateAction<THREE.Group<THREE.Object3DEventMap> | null>; }) => {
          setLargeHouseModel(gltf.scene);
          console.log("Loaded large model:", gltf.scene);
        });
      } catch (error) {
        console.error("Error loading models from Firebase Storage", error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  return { smallHouseModel, mediumHouseModel, largeHouseModel, loading };
};

export default useHouseModels;
