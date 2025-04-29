"use client";

import { useMemo, forwardRef } from "react";
import * as THREE from "three";
import type { BaseParameters, ControlPoint } from "@/types/curve";

interface VesselGeometryProps {
  baseParams: BaseParameters;
  controlPoints: ControlPoint[];
}

// ForwardRef is crucial to allow parent (Viewer3D) to access the mesh
const VesselGeometry = forwardRef<THREE.Mesh, VesselGeometryProps>(
  ({ baseParams, controlPoints }, ref) => {
    const geometry = useMemo(() => {
      const curve = new THREE.CatmullRomCurve3(
        controlPoints.map((p) => new THREE.Vector3(p.x, p.y, 0)),
        false,
        "centripetal",
        0.5
      );

      const points = curve.getPoints(50); // 50 profile points
      const shape = new THREE.Shape(points.map(p => new THREE.Vector2(p.x, p.y)));

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        steps: 1,
        depth: baseParams.wallThickness,
        bevelEnabled: false,
        extrudePath: new THREE.CurvePath<THREE.Vector3>(),
      };

      const latheGeometry = new THREE.LatheGeometry(
        points,
        64 // number of radial segments
      );

      return latheGeometry;
    }, [baseParams, controlPoints]);

    return (
      <mesh ref={ref} geometry={geometry}>
        <meshStandardMaterial color="#0077ff" metalness={0.1} roughness={0.8} />
      </mesh>
    );
  }
);

VesselGeometry.displayName = "VesselGeometry"; // For React DevTools

export default VesselGeometry;

