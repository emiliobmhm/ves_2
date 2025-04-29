"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { generateVesselGeometry, generateBaseCylinderGeometry } from "@/utils/generateGeometry";
import type { BaseParameters, ControlPoint } from "@/types/curve";
import * as THREE from "three";

interface VesselGeometryProps {
  baseParams: BaseParameters;
  controlPoints: ControlPoint[];
}

export default function VesselGeometry({ baseParams, controlPoints }: VesselGeometryProps) {
  const profileGeometry = useMemo(() => {
    if (!controlPoints || controlPoints.length < 2) {
      console.error("Not enough control points to generate vessel.");
      return new THREE.BufferGeometry();
    }
    try {
      const geom = generateVesselGeometry(baseParams, controlPoints);
      console.log("Generated Vessel Geometry:", geom);
      return geom;
    } catch (error) {
      console.error("Error generating vessel geometry:", error);
      return new THREE.BufferGeometry();
    }
  }, [baseParams, controlPoints]);

  const baseGeometry = useMemo(() => {
    if (!baseParams) {
      console.error("Base parameters missing.");
      return new THREE.BufferGeometry();
    }
    try {
      const geom = generateBaseCylinderGeometry(baseParams);
      console.log("Generated Base Cylinder Geometry:", geom);
      return geom;
    } catch (error) {
      console.error("Error generating base cylinder geometry:", error);
      return new THREE.BufferGeometry();
    }
  }, [baseParams]);

  // Ref for rotating animation
  const groupRef = useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1; // Slowly rotate
    }
  });

  const group = new THREE.Group();

  return (
    <group ref={groupRef as any}>
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
