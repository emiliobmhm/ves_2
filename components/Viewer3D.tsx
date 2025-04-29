"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { exportToSTL } from "@/utils/exportToSTL";
import type { BaseParameters, ControlPoint } from "@/types/curve";
import VesselGeometry from "./VesselGeometry"; // Adjust if needed

interface Viewer3DProps {
  baseParams: BaseParameters;
  controlPoints: ControlPoint[];
}

export default function Viewer3D({ baseParams, controlPoints }: Viewer3DProps) {
  const vesselRef = useRef<THREE.Mesh>(null);

  const handleExport = () => {
    if (vesselRef.current) {
      exportToSTL(vesselRef.current);
    }
  };

  return (
    <div className="relative w-full h-full">
      <button
        onClick={handleExport}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Export STL
      </button>

      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <PerspectiveCamera makeDefault position={[0, 150, 300]} fov={45} />
        <OrbitControls />
        <VesselGeometry ref={vesselRef} baseParams={baseParams} controlPoints={controlPoints} />
      </Canvas>
    </div>
  );
}
