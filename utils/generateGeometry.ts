import * as THREE from "three";
import type { BaseParameters, ControlPoint } from "@/types/curve";

export function generateVesselGeometry(baseParams: BaseParameters, controlPoints: ControlPoint[]): THREE.BufferGeometry {
  if (!controlPoints || controlPoints.length < 2) {
    console.error("generateVesselGeometry: Not enough control points");
    return new THREE.BoxGeometry(10, 10, 10); // Return something visible if broken
  }

  const shape = new THREE.Shape();
  shape.moveTo(controlPoints[0].x, controlPoints[0].y);
  controlPoints.slice(1).forEach((point) => {
    shape.lineTo(point.x, point.y);
  });

  const path = new THREE.CurvePath<THREE.Vector3>();
  path.add(new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, baseParams.maxHeight, 0)));

  const geometry = new THREE.LatheGeometry(
    controlPoints.map(p => new THREE.Vector2(p.x, p.y)),
    64
  );

  return geometry;
}

export function generateBaseCylinderGeometry(baseParams: BaseParameters): THREE.BufferGeometry {
  const radius = baseParams.outerDiameter / 2;
  const height = baseParams.wallThickness;
  const radialSegments = 32;

  return new THREE.CylinderGeometry(radius, radius, height, radialSegments);
}

