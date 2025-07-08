import React from 'react'
import * as THREE from 'three'

// Three.js Background Component
const ParticleBackground = ({ theme }) => {

    const mountRef = React.useRef();

    React.useEffect(() => {

        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: theme === 'dark' ? 0x4f46e5 : 0x8b5cf6,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 20;

        const animate = () => {

            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.0005;
            renderer.render(scene, camera);

        };

        animate();

        const handleResize = () => {
          
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        
        };

        window.addEventListener('resize', handleResize);

        return () => {
            
            window.removeEventListener('resize', handleResize);
            
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            
            renderer.dispose();
        
        };
    }, [theme]);

    return (
        <div
            ref={mountRef}
            className='fixed top-0 left-0 w-screen h-screen pointer-events-none opacity-30'
            style={{ zIndex: 1 }}
        />
    );
};

export default ParticleBackground;
