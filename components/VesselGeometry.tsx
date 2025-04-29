"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { generateVesselGeometry, generateBaseCylinderGeometry } from "@/utils/generateGeometry";
import type { BaseParameters, ControlPoint } from "@/types/curve";
import * as THREE from "three";

interface VesselGeometryProps {
  baseParams?: BaseParameters;
  controlPoints?: ControlPoint[];
}

export default function VesselGeometry({ baseParams, controlPoints }: VesselGeometryProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // Inject test data if missing
  const testBaseParams: BaseParameters = { outerDiameter: 100, wallThickness: 5, maxHeight: 200 };
  const testControlPoints: ControlPoint[] = [
    { x: 0, y: 0 },
    { x: 25, y: 50 },
    { x: 50, y: 80 },
    { x: 25, y: 100 },
  ];

  const safeBaseParams = baseParams ?? testBaseParams;
  const safeControlPoints = (controlPoints && controlPoints.length > 1) ? controlPoints : testControlPoints;

  const profileGeometry = useMemo(() => {
    try {
      const geom = generateVesselGeometry(safeBaseParams, safeControlPoints);
      console.log("Generated Vessel Geometry:", geom);
      return geom;
    } catch (error) {
      console.error("Error generating vessel geometry:", error);
      return new THREE.BoxGeometry(10, 10, 10);
    }
  }, [safeBaseParams, safeControlPoints]);

  const baseGeometry = useMemo(() => {
    try {
      const geom = generateBaseCylinderGeometry(safeBaseParams);
      console.log("Generated Base Cylinder Geometry:", geom);
      return geom;
    } catch (error) {
      console.error("Error generating base cylinder geometry:", error);
      return new THREE.BoxGeometry(10, 10, 10);
    }
  }, [safeBaseParams]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Profile Vessel */}
      {profileGeometry && profileGeometry.attributes.position ? (
        <mesh geometry={profileGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#4287f5" metalness={0.5} roughness={0.5} />
        </mesh>
      ) : (
        <mesh>
          <boxGeometry args={[10, 10, 10]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
      )}

      {/* Base Cylinder */}
      {baseGeometry && baseGeometry.attributes.position ? (
        <mesh geometry={baseGeometry} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.7} />
        </mesh>
      ) : null}
    </group>
  );
}
