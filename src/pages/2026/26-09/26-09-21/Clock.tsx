import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import font26_09_21 from '@/assets/fonts/26fonts/26-09-21.ttf?url';

import styles from './Clock.module.css';

export const assets = [font26_09_21];

const fontConfig: FontConfig = {
    fontFamily: 'ClockFont_26_09_21',
    fontUrl: font26_09_21,
};

const DIGIT_WIDTH = 1.1;
const DIGIT_HEIGHT = 1.5;
const DIGIT_DEPTH = 0.55;
const DIGIT_SPACING = 1.45;

const SPIN_SPEED = 0.55;
const WOBBLE_SPEED = 0.0004;
const WOBBLE_AMPLITUDE = 0.12;

const TEXTURE_SIZE = 512;

const DIGIT_COLOR = '#abd913';
const FACE_COLOR = '#bc75b6';
const SIDE_COLOR = '#17174d';

function createDigitTexture(
    character: string,
    mirrored = false,
): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');

    canvas.width = TEXTURE_SIZE;
    canvas.height = TEXTURE_SIZE;

    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Unable to create 2D canvas context.');
    }

    context.fillStyle = FACE_COLOR;
    context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

    context.strokeStyle = '#6d6d8d';
    context.lineWidth = 12;
    context.strokeRect(
        9,
        9,
        TEXTURE_SIZE - 18,
        TEXTURE_SIZE - 18,
    );

    context.font =
        '700 340px ClockFont_26_09_21, Arial, Helvetica, sans-serif';

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = DIGIT_COLOR;

    if (mirrored) {
        context.save();
        context.translate(TEXTURE_SIZE, 0);
        context.scale(-1, 1);
    }

    context.fillText(
        character,
        TEXTURE_SIZE / 2,
        TEXTURE_SIZE / 2 + 10,
    );

    if (mirrored) {
        context.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;

    return texture;
}

interface DigitMeshProps {
    character: string;
    x: number;
    reducedMotion: boolean;
    spinOffset: number;
}

function DigitMesh({
    character,
    x,
    reducedMotion,
    spinOffset,
}: DigitMeshProps) {
    const groupRef = useRef<THREE.Group>(null);

    const materials = useMemo(() => {
        const side = new THREE.MeshStandardMaterial({
            color: SIDE_COLOR,
            metalness: 0.2,
            roughness: 0.5,
        });

        const face = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.05,
            roughness: 0.42,
        });

        const back = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.05,
            roughness: 0.42,
        });

        return [side, side, side, side, face, back];
    }, []);

    useEffect(() => {
        const frontTexture = createDigitTexture(character);
        const backTexture = createDigitTexture(character, true);

        const frontMaterial =
            materials[4] as THREE.MeshStandardMaterial;

        const backMaterial =
            materials[5] as THREE.MeshStandardMaterial;

        frontMaterial.map = frontTexture;
        frontMaterial.needsUpdate = true;

        backMaterial.map = backTexture;
        backMaterial.needsUpdate = true;

        return () => {
            frontTexture.dispose();
            backTexture.dispose();

            frontMaterial.map = null;
            backMaterial.map = null;

            frontMaterial.needsUpdate = true;
            backMaterial.needsUpdate = true;
        };
    }, [character, materials]);

    useFrame((_, delta) => {
        const group = groupRef.current;

        if (!group || reducedMotion) return;

        group.rotation.y += delta * SPIN_SPEED;

        group.rotation.x =
            Math.sin(
                performance.now() * WOBBLE_SPEED + spinOffset,
            ) * WOBBLE_AMPLITUDE;
    });

    return (
        <group
            ref={groupRef}
            position={[x, 0, 0]}
        >
            <mesh
                material={materials}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    args={[
                        DIGIT_WIDTH,
                        DIGIT_HEIGHT,
                        DIGIT_DEPTH,
                    ]}
                />
            </mesh>
        </group>
    );
}

interface ClockSceneProps {
    digits: string[];
    reducedMotion: boolean;
}

function ClockScene({
    digits,
    reducedMotion,
}: ClockSceneProps) {
    const positions = [
        -1.5 * DIGIT_SPACING,
        -0.5 * DIGIT_SPACING,
        0.5 * DIGIT_SPACING,
        1.5 * DIGIT_SPACING,
    ];

    return (
        <>
            <color
                attach="background"
                args={['#7f7fbb']}
            />

            <ambientLight intensity={0.85} />

            <directionalLight
                position={[5, 8, 6]}
                intensity={1.15}
                castShadow
            />

            <directionalLight
                position={[-4, 2, -3]}
                intensity={0.35}
            />

            {digits.map((character, index) => (
                <DigitMesh
                    key={`${index}-${character}`}
                    character={character}
                    x={positions[index]}
                    reducedMotion={reducedMotion}
                    spinOffset={index * 1.1}
                />
            ))}
        </>
    );
}

const Clock = () => {
    const time = useClock();
    const [reducedMotion, setReducedMotion] = useState(false);

    useSuspenseFontLoader([fontConfig]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        const updateReducedMotion = () => {
            setReducedMotion(mediaQuery.matches);
        };

        updateReducedMotion();

        mediaQuery.addEventListener(
            'change',
            updateReducedMotion,
        );

        return () => {
            mediaQuery.removeEventListener(
                'change',
                updateReducedMotion,
            );
        };
    }, []);

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');

    const digits = [
        hours[0],
        hours[1],
        minutes[0],
        minutes[1],
    ];

    return (
        <main className={styles.container}>
            <Canvas
                className={styles.canvas}
                camera={{
                    position: [0, 0.2, 7.2],
                    fov: 40,
                    near: 0.1,
                    far: 100,
                }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: false,
                }}
                shadows
            >
                <ClockScene
                    digits={digits}
                    reducedMotion={reducedMotion}
                />
            </Canvas>

            <time
                className={styles.srOnly}
                dateTime={time.toISOString()}
            >
                {hours}
                {minutes}
            </time>
        </main>
    );
};

Clock.displayName = 'Clock_26_09_21';

export default Clock;