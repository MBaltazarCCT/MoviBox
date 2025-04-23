import React from "react";
import { useEffect, useState } from "react";

import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Grid,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  useGLTF,
  CameraControls,
} from "@react-three/drei";
import { eachDayOfInterval } from "date-fns";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import "./MapaStyles.css";



function MapaPatio() {
  const [cntSeleccionado, setCntSeleccionado] = useState(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04042a);

    //fullscreen

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 40;

    scene.add(camera);

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
      const folder = gui.addFolder(name);
      folder.add(vector3, "x", -10, 100).onChange(onChangeFn);
      folder.add(vector3, "y", 0, 100).onChange(onChangeFn);
      folder.add(vector3, "z", -10, 100).onChange(onChangeFn);
      // folder.open();
    }

    const color = 0xffffff;
    const intensity = 2.08;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true;
    light.position.set(0, 10, 0);
    light.target.position.set(-4, 0, -4);
    scene.add(light);
    scene.add(light.target);

    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xb5b5b5,
      side: THREE.DoubleSide,
    });

    const ambientLight = new THREE.AmbientLight(0xfeeeb4, 0.5);
    scene.add(ambientLight);

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);

    //scene.add(cameraHelper);

    const helper = new THREE.DirectionalLightHelper(light);
    //scene.add(helper);

    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }

    class backgroundColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }

    class colorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }

    function updateCamera() {
      // update the light target's matrixWorld because it's needed by the helper
      light.target.updateMatrixWorld();
      helper.update();
      // update the light's shadow camera's projection matrix
      light.shadow.camera.updateProjectionMatrix();
      // and now update the camera helper we're using to show the light's shadow camera
      light.shadow.camera.zoom = 0.06;
      cameraHelper.update();
    }

    updateCamera();

    class DimensionGUIHelper {
      constructor(obj, minProp, maxProp) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
      }
      get value() {
        return this.obj[this.maxProp] * 2;
      }
      set value(v) {
        this.obj[this.maxProp] = v / 2;
        this.obj[this.minProp] = v / -2;
      }
    }

    class MinMaxGUIHelper {
      constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
      }
      get min() {
        return this.obj[this.minProp];
      }
      set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(
          this.obj[this.maxProp],
          v + this.minDif
        );
      }
      get max() {
        return this.obj[this.maxProp];
      }
      set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min; // this will call the min setter
      }
    }

    //fullscreen

    const fullscreenIcon = document.getElementById("fullscreenIcon");
    fullscreenIcon.addEventListener("click", () => {
      document.addEventListener("fullscreenchange", () => {
        const canvas = document.getElementById("mapa");
        if (!document.fullscreenElement) {
          // Saliste de fullscreen
          renderer.setSize(window.innerWidth, window.innerHeight / 2);
        } else {
          // Entraste a fullscreen
          renderer.setSize(window.screen.width + 20, window.screen.height);
        }

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      });
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        canvas.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
      }
    });

    /*     const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
    gui.addColor(new ColorGUIHelper(ambientLight, "color"), "value").name("ambient Light");
    gui
      .addColor(new backgroundColorGUIHelper(scene, "background"), "value")
      .name("background");
    gui
      .addColor(new colorGUIHelper(planeMaterial, "color"), "value")
      .name("plane color");

    gui.add(light, "intensity", 0, 10, 0.01);
    {
      const folder = gui.addFolder("Shadow Camera");
      folder.open();
      folder
        .add(
          new DimensionGUIHelper(light.shadow.camera, "left", "right"),
          "value",
          1,
          100
        )
        .name("width")
        .onChange(updateCamera);
      folder
        .add(
          new DimensionGUIHelper(light.shadow.camera, "bottom", "top"),
          "value",
          1,
          100
        )
        .name("height")
        .onChange(updateCamera);
      const minMaxGUIHelper = new MinMaxGUIHelper(
        light.shadow.camera,
        "near",
        "far",
        0.1
      );
      folder
        .add(minMaxGUIHelper, "min", 0.1, 50, 0.1)
        .name("near")
        .onChange(updateCamera);
      folder
        .add(minMaxGUIHelper, "max", 0.1, 500, 0.1)
        .name("far")
        .onChange(updateCamera);
      folder
        .add(light.shadow.camera, "zoom", 0.01, 1.5, 0.01)
        .onChange(updateCamera);
    }

    makeXYZGUI(gui, light.position, "position", updateCamera);
    makeXYZGUI(gui, light.target.position, "target", updateCamera); */

    const canvas = document.getElementById("mapa");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.setSize(window.innerWidth, window.innerHeight / 2 + 100);

    // Inicializar los controles OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);


    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    //grid

    const gridHelper = new THREE.GridHelper(200, 30, 0xf3f3f3, 0xf6f6f6);
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    scene.add(gridHelper);

    const loader = new THREE.TextureLoader();

    function loadColorTexture(path) {
      const texture = loader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    light.castShadow = true;
    light.position.set(200, 200, 0);
    light.target.position.set(-4, 0, -4);
    scene.add(light);
    scene.add(light.target);

    const path = "/contenedores/"; // Nota la barra al inicio

    const colores = ["grey", "blue", "green", "red", "purple", "orange"];

    // Creamos un array para almacenar todos los arrays de materiales
    const boxMaterials = [];

    // Usamos un ciclo for para crear un array de materiales para cada color
    for (let i = 0; i < colores.length; i++) {
      const color = colores[i];

      // Creamos el array de materiales para este color
      const boxMaterial = [
        new THREE.MeshStandardMaterial({
          map: loader.load(path + `container001-${color}-small.png`),
        }),
        new THREE.MeshStandardMaterial({
          map: loader.load(path + `container001-${color}-small.png`),
        }),
        new THREE.MeshStandardMaterial({
          map: loader.load(path + `container001-${color}-small.png`),
        }),
        new THREE.MeshStandardMaterial({
          map: loader.load(path + `container001-${color}-small.png`),
        }),
        new THREE.MeshStandardMaterial({
          map: loader.load(path + `container004-${color}-small.png`),
        }),
        new THREE.MeshStandardMaterial({
          map: loader.load(path + `container002-${color}-small.png`),
        }),
      ];

      // Almacenamos el array con el nombre boxMaterial1, boxMaterial2, etc.
      boxMaterials[i] = boxMaterial;

      // También creamos variables individuales boxMaterial1, boxMaterial2, etc.
      eval(`const boxMaterial${i + 1} = boxMaterial;`);
    }


    const boxGeometry = new THREE.BoxGeometry(5, 5, 10);

    let j = -56.5;
    let cnt = 1;
    let fila = 1;
    let distancia = -20;
    let altura = 2.5;

    const fontLoader = new FontLoader();

    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        for (let i = 1; i < 225; i++) {
          const randomIndex = Math.floor(Math.random() * boxMaterials.length);
          const boxMesh = new THREE.Mesh(
            boxGeometry,
            boxMaterials[randomIndex]
          );



          if (cnt === 3) {
            distancia += 15;
            cnt = 2;
            boxMesh.position.x = distancia;
          } else {
            distancia += 5.5;
            cnt += 1;
            boxMesh.position.x = distancia;
          }

          fila += 1;

          boxMesh.position.z = j - 20;
          boxMesh.position.y = altura;

          if (i === 100) {
            altura = 7.5;
            j = -56.5;
            cnt = 1;
            fila = 1;
            distancia = -20;
          }

          if (i === 200) {
            altura = 12.5;
            j = -56.5;
            cnt = 1;
            fila = 1;
            distancia = -20;
          }

          if (fila === 7) {
            distancia = -20;
            fila = 1;
            cnt = 1;
            j += 10.5;
          }

          const textGeometry = new TextGeometry("CSNU6277796", {
            font: font,
            size: 1,
            depth: 5,
            height: 0.2,
            bevelEnabled: false,
            bevelThickness: 0.01,
            bevelSize: 0.01,
          });



          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          boxMesh.castShadow = true;
          boxMesh.receiveShadow = true;

          textMesh.position.set(
            boxMesh.position.x - 2.5, // Center horizontally
            boxMesh.position.y,
            boxMesh.position.z + 4.5 // Center vertically
          );

          textMesh.rotateY(Math.PI / 2);

          if (i < 201) {
            scene.add(boxMesh);
          } else {
            if (Math.round(Math.random()) === 0) {
              scene.add(boxMesh);
            }
          }
        }
      }
    );



    // Definir velocidad de movimiento

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <>
      <div id="fullscreenIcon">&#x26F6;</div>

      <canvas id="mapa"></canvas>

    </>
  );
}



export default MapaPatio;
