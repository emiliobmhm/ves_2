"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid, Environment, Text } from "@react-three/drei";
import VesselGeometry from "./VesselGeometry";
import type { ControlPoint, BaseParameters } from "@/types/curve";
import { colors } from "@/styles/theme";

interface Viewer3DProps {
  baseParams: BaseParameters;
  controlPoints: ControlPoint[];
}

export default function Viewer3D({ baseParams, controlPoints }: Viewer3DProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Debugging incoming props
  console.log("Viewer3D Props - baseParams:", baseParams);
  console.log("Viewer3D Props - controlPoints:", controlPoints);

  // Only render on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Temporary: Force testing data
  const baseParamsTest: BaseParameters = {
    outerDiameter: 100,
    wallThickness: 5,
    maxHeight: 200,
  };

  const controlPointsTest: ControlPoint[] = [
    { x: 0, y: 0 },
    { x: 50, y: 50 },
    { x: 30, y: 100 },
    { x: 0, y: 200 },
  ];

  // Handle errors in the 3D rendering
  const handleError = (error: Error) => {
    console.error("Error in 3D viewer:", error);
    setErrorMessage(error.message || "Error rendering 3D scene");
  };

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-mono">Loading 3D viewer...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-mono text-red-500">Error: {errorMessage}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setErrorMessage(null)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If invalid incoming props, show message
  if (!baseParams || !controlPoints || controlPoints.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-lg font-mono text-red-500">Invalid parameters. Cannot render 3D model.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas shadows className="w-full h-full" onError={handleError}>
        <color attach="background" args={[colors.background]} />
        <PerspectiveCamera makeDefault position={[0, 150, 300]} fov={40} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 100, 100]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight position={[-100, 100, 100]} intensity={0.8} angle={0.5} penumbra={1} castShadow />

        <Suspense fallback={<LoadingFallback />}>
          {/* Use testing data */}
          <VesselGeometryWrapper baseParams={baseParamsTest} controlPoints={controlPointsTest} />
        </Suspense>

        <Grid
          args={[500, 500]}
          cellSize={10}
          cellThickness={0.5}
          cellColor="#CCCCCC"
          position={[0, -0.1, 0]}
          infiniteGrid
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={50}
          maxDistance={500}
          target={[0, baseParamsTest.maxHeight / 2, 0]}
        />
        <Environment preset="studio" />
        <axesHelper args={[50]} />

        <group position={[-100, 0, 0]}>
          <mesh position={[0, 50, 0]}>
            <boxGeometry args={[1, 100, 1]} />
            <meshStandardMaterial color="#CCCCCC" />
          </mesh>
          <Text position={[15, 0, 0]} fontSize={10} color="#CCCCCC" font="/fonts/GeistMono-Bold.ttf">
            100MM
          </Text>
        </group>
      </Canvas>

      <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
        Points: {controlPointsTest.length} | Diameter: {baseParamsTest.outerDiameter}mm | Height: {baseParamsTest.maxHeight}mm
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <Text position={[0, 0, 0]} fontSize={20} color="#CCCCCC">
      Loading 3D model...
    </Text>
  );
}

// Wrapper component with error handling
function VesselGeometryWrapper({ baseParams, controlPoints }: Viewer3DProps) {
  try {
    return <VesselGeometry baseParams={baseParams} controlPoints={controlPoints} />;
  } catch (error) {
    console.error("Error rendering vessel geometry:", error);
    return (
      <Text position={[0, 0, 0]} fontSize={20} color="red">
        Error rendering vessel. Please check console.
      </Text>
    );
  }
}
