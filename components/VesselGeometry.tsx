"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { ControlPoint, BaseParameters } from "@/types/curve"
import { generateVesselGeometry, generateBaseCylinderGeometry } from "@/utils/generateGeometry"
import { colors, materials } from "@/styles/theme"

interface VesselGeometryProps {
  baseParams: BaseParameters
  controlPoints: ControlPoint[]
}

export default function VesselGeometry({ baseParams, controlPoints }: VesselGeometryProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [error, setError] = useState<string | null>(null)

  // Validate input parameters
  useEffect(() => {
    // Check for valid control points
    if (!controlPoints || controlPoints.length < 2) {
      setError("Not enough control points to generate geometry")
      return
    }

    // Check for valid base parameters
    if (baseParams.outerDiameter <= 0 || baseParams.height <= 0 || baseParams.maxHeight <= 0) {
      setError("Invalid base parameters")
      return
    }

    setError(null)
  }, [baseParams, controlPoints])

  // Generate the base cylinder geometry
  const baseCylinderGeometry = useMemo(() => {
    try {
      return generateBaseCylinderGeometry(baseParams)
    } catch (err) {
      console.error("Error generating base cylinder:", err)
      setError("Failed to generate base cylinder")
      return new THREE.BufferGeometry()
    }
  }, [baseParams])

  // Generate the vessel profile geometry with wall thickness
  const profileGeometry = useMemo(() => {
    try {
      // Ensure the first control point matches the base cylinder's top edge
      // and the last point is at maxHeight
      const adjustedControlPoints = [...controlPoints]

      // Fix first point to match base cylinder
      adjustedControlPoints[0] = {
        ...adjustedControlPoints[0],
        x: baseParams.outerDiameter / 2,
        y: 0, // Will be positioned at baseParams.height
      }

      // Fix last point to maxHeight
      const lastIndex = adjustedControlPoints.length - 1
      adjustedControlPoints[lastIndex] = {
        ...adjustedControlPoints[lastIndex],
        y: baseParams.maxHeight,
      }

      return generateVesselGeometry(adjustedControlPoints, baseParams)
    } catch (err) {
      console.error("Error in profile geometry generation:", err)
      setError("Failed to generate profile geometry")
      return new THREE.BufferGeometry()
    }
  }, [controlPoints, baseParams])

  // Position the geometries correctly
  useMemo(() => {
    try {
      // Center the base cylinder at the origin
      baseCylinderGeometry.translate(0, baseParams.height / 2, 0)
    } catch (err) {
      console.error("Error positioning geometry:", err)
    }
  }, [baseCylinderGeometry, baseParams.height])

  // Gentle rotation animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  // Create a material for all vessel parts
  const vesselMaterial = (
    <meshStandardMaterial
      color={colors.vessel}
      roughness={materials.vessel.roughness}
      metalness={materials.vessel.metalness}
      emissive={materials.vessel.emissive}
      side={THREE.DoubleSide}
    />
  )

  // If there's an error, show a simple error indicator
  if (error) {
    return (
      <mesh position={[0, 50, 0]}>
        <boxGeometry args={[20, 20, 20]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  return (
    <group ref={groupRef}>
      {/* Base cylinder */}
      <mesh geometry={baseCylinderGeometry} castShadow receiveShadow>
        {vesselMaterial}
      </mesh>

      {/* Profile geometry - positioned at the top of the base cylinder */}
      <mesh geometry={profileGeometry} castShadow receiveShadow position={[0, baseParams.height, 0]}>
        {vesselMaterial}
      </mesh>
    </group>
  )
}
