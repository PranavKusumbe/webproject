import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

// Particle system for shatter effect
class ShatterParticle {
  constructor(position, velocity, color) {
    this.position = new THREE.Vector3(...position);
    this.velocity = new THREE.Vector3(...velocity);
    this.color = color;
    this.life = 1.0;
    this.size = Math.random() * 0.1 + 0.05;
  }

  update(delta) {
    // Physics
    this.velocity.y -= 9.8 * delta; // Gravity
    this.position.add(this.velocity.clone().multiplyScalar(delta));
    this.life -= delta * 0.5;
    return this.life > 0;
  }
}

// 3D Medicine Card Component with advanced animations
const MedicineCard3D = ({ 
  position, 
  medicine, 
  onClick, 
  onHover,
  onDeleteStart,
  isExpired, 
  isLowStock,
  shattering = false,
  index = 0
}) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const [shatterProgress, setShatterProgress] = useState(0);

  // Floating animation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (shattering) {
      // Shatter animation
      setShatterProgress(prev => Math.min(prev + delta * 2, 1));
      
      if (shatterProgress < 1) {
        // Pieces fly apart
        const children = groupRef.current.children;
        children.forEach((child, i) => {
          if (child.isMesh) {
            const angle = (i / children.length) * Math.PI * 2;
            child.position.x += Math.cos(angle) * delta * 3;
            child.position.y += Math.sin(angle + Math.PI) * delta * 3;
            child.position.z += Math.sin(i) * delta * 2;
            child.rotation.x += delta * 5;
            child.rotation.y += delta * 3;
            child.scale.multiplyScalar(0.98);
          }
        });
      }

      // Update particles
      setParticles(prevParticles => 
        prevParticles
          .map(p => {
            p.update(delta);
            return p;
          })
          .filter(p => p.life > 0)
      );
    } else {
      // Normal floating animation
      const time = state.clock.getElapsedTime() + index * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.1;
      
      if (hovered) {
        groupRef.current.rotation.y += delta * 2;
        groupRef.current.position.z = Math.lerp(groupRef.current.position.z, position[2] + 0.5, delta * 5);
      } else {
        groupRef.current.rotation.y += delta * 0.3;
        groupRef.current.position.z = Math.lerp(groupRef.current.position.z, position[2], delta * 5);
      }

      // Expired items shake
      if (isExpired) {
        groupRef.current.rotation.x = Math.sin(time * 5) * 0.1;
        groupRef.current.rotation.z = Math.cos(time * 4) * 0.08;
      }
    }
  });

  // Create shatter particles when shattering starts
  useEffect(() => {
    if (shattering && particles.length === 0) {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        newParticles.push(
          new ShatterParticle(
            [position[0], position[1], position[2]],
            [
              Math.cos(angle) * speed,
              Math.random() * 5 + 3,
              Math.sin(angle) * speed
            ],
            isExpired ? '#ef4444' : '#3b82f6'
          )
        );
      }
      setParticles(newParticles);
    }
  }, [shattering, particles.length, position, isExpired]);

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(medicine);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
  };

  const cardColor = isExpired ? '#ef4444' : isLowStock ? '#f59e0b' : '#3b82f6';
  const emissiveColor = isExpired ? '#ff0000' : isLowStock ? '#ff8800' : '#0066ff';
  const scale = hovered ? 1.15 : 1;
  const opacity = shattering ? Math.max(0, 1 - shatterProgress) : 1;

  return (
    <>
      <group ref={groupRef} position={position}>
        {/* Main Card */}
        <Float
          speed={2}
          rotationIntensity={hovered ? 2 : 0.5}
          floatIntensity={hovered ? 1 : 0.3}
        >
          <mesh
            ref={meshRef}
            onClick={() => !shattering && onClick?.(medicine)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            scale={scale}
          >
            <boxGeometry args={[1.2, 1.6, 0.15]} />
            <meshStandardMaterial
              color={cardColor}
              transparent
              opacity={opacity}
              roughness={0.3}
              metalness={0.6}
              emissive={emissiveColor}
              emissiveIntensity={(isExpired || isLowStock) ? 0.4 : 0.1}
            />
          </mesh>

          {/* Medicine Icon */}
          <mesh position={[0, 0.3, 0.08]}>
            <circleGeometry args={[0.3, 32]} />
            <meshStandardMaterial
              color="white"
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Name background */}
          <mesh position={[0, -0.2, 0.08]}>
            <planeGeometry args={[1.1, 0.4]} />
            <meshStandardMaterial
              color="#1f2937"
              transparent
              opacity={opacity * 0.8}
            />
          </mesh>
        </Float>

        {/* Glow rings for status */}
        {(isExpired || isLowStock) && !shattering && (
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
            <ringGeometry args={[0.6, 0.75, 32]} />
            <meshBasicMaterial
              color={isExpired ? '#ff0000' : '#ffaa00'}
              transparent
              opacity={0.6 + Math.sin(Date.now() * 0.005) * 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Sparkles on hover */}
        {hovered && !shattering && (
          <Sparkles
            count={30}
            scale={2}
            size={3}
            speed={0.6}
            opacity={0.8}
            color={cardColor}
          />
        )}

        {/* Point light for glow */}
        {(isExpired || isLowStock) && !shattering && (
          <pointLight
            position={[0, 0, 0.5]}
            intensity={hovered ? 2 : 1}
            distance={3}
            color={isExpired ? '#ff0000' : '#ff8800'}
            decay={2}
          />
        )}
      </group>

      {/* Render particles */}
      {shattering && particles.map((particle, i) => (
        <mesh key={i} position={[particle.position.x, particle.position.y, particle.position.z]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={particle.life}
          />
        </mesh>
      ))}
    </>
  );
};

export default MedicineCard3D;
