import * as React from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";

const scratchObject3D = new THREE.Object3D();

const Render_contenedores = ({
  data,
  contenedorSeleccionado,
  onSelectPoint,
  texture
}) => {
  const meshRef = React.useRef();
  const colorArrayRef = React.useRef();
  const numPoints = data.length;
  


  // 🔽 Carga la textura desde un archivo PNG (asegúrate de que esté en la carpeta pública o importada)


  React.useEffect(() => {
    const mesh = meshRef.current;
    const colorArray = new Float32Array(numPoints * 3);

    data.forEach((item, i) => {
      const x = (item.id % 6) * 2.2 - (item.id % 2);
      const y = Math.floor(item.id / 100) * 1.05;
      const z = Math.floor((item.id - Math.floor(item.id / 100) * 100) / 6) * 2.05;
      

      scratchObject3D.position.set(x, y, z);
      scratchObject3D.updateMatrix();
      mesh.setMatrixAt(i, scratchObject3D.matrix);

      colorArray.set([1, 1, 1], i * 3);
    })

    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colorArray, 3)
    );
    colorArrayRef.current = colorArray;
  }, [numPoints]);

  React.useEffect(() => {
    if (!meshRef.current || contenedorSeleccionado == null) return;

    const mesh = meshRef.current;
    const colorArray = colorArrayRef.current;

    for (let i = 0; i < numPoints; i++) {
      colorArray.set([1, 1, 1], i * 3);
    }

    const index = data.findIndex((p) => p.id === contenedorSeleccionado.id);
    if (index !== -1) {
      colorArray.set([1, 0, 0], index * 3); // rojo
    }

    mesh.geometry.attributes.color.needsUpdate = true;
  }, [contenedorSeleccionado, data, numPoints]);

     const handlePointerDown = (event) => {
    event.stopPropagation(); //

    const index = event.instanceId;
    if (index === undefined) return;

    const point = data[index];
    onSelectPoint(point);
  };

  return (
    <instancedMesh
      castShadow
      receiveShadow
      ref={meshRef}
      args={[null, null, data.length]}
      frustumCulled={false}
      onPointerDown={handlePointerDown}>
      <boxGeometry args={[1, 1, 2]} />
      <meshStandardMaterial map={texture} vertexColors />
    </instancedMesh>
  );
};

export default Render_contenedores;
