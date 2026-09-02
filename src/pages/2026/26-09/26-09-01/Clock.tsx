import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Mesh, Circle, useGLTF } from '@react-three/drei';

const Clock = ({ text, size }) => {
    const mesh = useGLTF('clock.glb'); // Replace 'clock.glb' with the actual path to your clock model
    return (
        <mesh rotation={[0, 0, 0]} scale={size}>
            {mesh.children.map((child, i) =>
                <primitive
                    key={i}
                    geometry={child.geometry}
                    position={child.position}
                    rotation={child.rotation}
                    material={child.material}
                />
            )}
        </mesh>
    );
};

const ClockCircle = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const timeInterval = useRef(0); // Keep track of the interval id
    const containerRef = useRef(null);

    useEffect(() => {
        const handleRotation = () => {
            setRotation(prevRotation => ({
                x: prevRotation.x + 0.01,
                y: prevRotation.y + 0.01,
                z: prevRotation.z,
            }));
        };

        // Start the rotation on component mount
        timeInterval.current = setInterval(handleRotation, 20);  // Adjust speed as needed (milliseconds)

        // Clean up the interval when the component unmounts
        return () => clearInterval(timeInterval.current);
    }, []);

    useFrame(() => {
        // This is the most reliable way to rotate in Three.js in React
        // Because the component is re-rendered every frame, the rotation is applied on each render.
    });


    return (
        <group ref={containerRef} rotateY={rotation.y} >
            <Circle
                radius={1}
                args={[0, 0, 0]}
                rotation={[0, 0, 0]}
                position={[0, 0, 0]}
                scale={1}
            />
            {/* Clock Instances */}
            <Clock text="00:00" size={[0.1, 0.1, 0.1]} />
            <Clock text="01:00" size={[0.1, 0.1, 0.1]} />
            <Clock text="02:00" size={[0.1, 0.1, 0.1]} />
            <Clock text="03:00" size={[0.1, 0.1, 0.1]} />
            <Clock text="04:00" size={[0.1, 0.1, 0.1]} />
        </group>
    );
};

const BorrowedTime = () => {
    return (
        <Box
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
            }}
        >
            <OrbitControls  // Allows user to rotate the camera around the scene
                ref={containerRef}
            />
            <ClockCircle />
        </Box>
    );
};

export default BorrowedTime;
