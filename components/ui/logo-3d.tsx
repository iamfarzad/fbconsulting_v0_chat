'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Logo3DProps {
  className?: string;
}

export function Logo3D({ className }: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(40, 40);
    containerRef.current.appendChild(renderer.domElement);

    // Create FB logo-like geometry
    const geometry = new THREE.BoxGeometry(1.5, 1, 0.2);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#4267B2'),
      shininess: 100,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.z = 2;

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    // Handle cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
