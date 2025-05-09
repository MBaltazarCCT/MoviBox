import React, { useState, useRef, useEffect,} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {

  CameraControls, Html
} from "@react-three/drei";
import Render_contenedores from './Render_contenedores';
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import "./styles.css"
import { useControls } from "leva";

function Patio( {data} ) {

    const [contenedorSeleccionado, SetContenedorSeleccionado] = useState("fasdf")

    const colores = ["verde", "rojo", "azul", "gris", "naranja"];

    const groupedByColor = colores.reduce((acc, color) => {
      acc[color] = data.filter((item) => item.color === color);
      return acc;
    }, {});

    console.log(groupedByColor);

    const textureMap = {
      verde: useLoader(
        THREE.TextureLoader,
        "/contenedores/container001-verde-small.png"
      ),
      rojo: useLoader(
        THREE.TextureLoader,
        "/contenedores/container001-rojo-small.png"
      ),
      azul: useLoader(
        THREE.TextureLoader,
        "/contenedores/container001-azul-small.png"
      ),
      gris: useLoader(
        THREE.TextureLoader,
        "/contenedores/container001-gris-small.png"
      ),
      naranja: useLoader(
        THREE.TextureLoader,
        "/contenedores/container001-naranja-small.png"
      ),
    };

    const groundTexture = useLoader(
        THREE.TextureLoader,
        "/contenedores/ground.jpg"
      )    

  return (
    <div className="contenedor">
      <div className="datos_cnt">
        <ul>
          <li>
            {" "}
            <strong> ID </strong>: {contenedorSeleccionado?.id}
          </li>
          <li>
            <strong> Color </strong>: {contenedorSeleccionado?.color}
          </li>
          <li>
            <strong> Estado </strong>: {contenedorSeleccionado?.estado}
          </li>
          <li>
            <strong> Peso </strong>: {contenedorSeleccionado?.peso}kg
          </li>
        </ul>
      </div>
      <Canvas shadows>
        <CameraControlPanel />
        <ambientLight color="#ffffff" intensity={1} />
        <directionalLight
          castShadow
          position={[5, 10, 0]}
          intensity={5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <hemisphereLight
          skyColor="#dbeafe"
          groundColor="#1e293b"
          intensity={0.6}
        />
        <group position={[0, -0.51, 16]}>
          {/* Fondo azul oscuro */}
          <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
              map={groundTexture}
              side={THREE.DoubleSide}
              receiveShadow
            />
          </mesh>

          {/* Rejilla blanca sobre el fondo */}
          <gridHelper
            args={[100, 75, "gray", "gray"]} // tamaño, divisiones, color del centro, color de líneas
            position={[0, 0.01, 0]} // Levanta ligeramente para evitar z-fighting
          />
        </group>
        {colores.map((color) => (
          <Render_contenedores
            key={color}
            data={groupedByColor[color]}
            texture={textureMap[color]}
            onSelectPoint={SetContenedorSeleccionado}
          />
        ))}
      </Canvas>
    </div>
  );
}

function CameraControlPanel() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(20, 11, 36, -19, -14, 12, true);
    }
  }, []);

  return (
    <CameraControls
      ref={controlsRef}
      camera={camera}
      domElement={gl.domElement}
    />
  );
}

export default Patio