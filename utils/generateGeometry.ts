import * as THREE from "three";
import type { BaseParameters, ControlPoint } from "@/types/curve";

// Generates a basic cylinder
export function generateBaseCylinderGeometry(baseParams: BaseParameters): THREE.BufferGeometry {
  const { outerDiameter, maxHeight } = baseParams;

  const radius = outerDiameter / 2;
  const height = maxHeight;

  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
  geometry.rotateX(Math.PI / 2); // Rotate to lay flat if needed
  return geometry;
}

// Generates a simple lathe vessel from control points
export function generateVesselGeometry(
  baseParams: BaseParameters,
  controlPoints: ControlPoint[]
): THREE.BufferGeometry {
  const points: THREE.Vector2[] = controlPoints.map((pt) => new THREE.Vector2(pt.x, pt.y));

  // If points are too few, return a simple cylinder to avoid crash
  if (points.length < 2) {
    console.warn("generateVesselGeometry: Not enough points, returning fallback cylinder.");
    return new THREE.CylinderGeometry(20, 20, 50, 32);
  }

  const lathe = new THREE.LatheGeometry(points, 64);
  lathe.rotateX(Math.PI / 2); // Optional: Rotate to lay flat
  return lathe;
}
