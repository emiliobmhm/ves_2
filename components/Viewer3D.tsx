"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import VesselGeometry from "./VesselGeometry"; // Adjust path if needed
import type { ControlPoint, BaseParameters } from "@/types/curve";

interface Viewer3DProps {
  baseParams: BaseParameters;
  controlPoints: ControlPoint[];
}

export default function Viewer3D({ baseParams, controlPoints }: Viewer3DProps) {
  return (
    <Canvas camera={{ position: [0, 150, 300], fov: 45 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <VesselGeometry baseParams={baseParams} controlPoints={controlPoints} />
      <OrbitControls />
    </Canvas>
  );
}
