import { useEffect, useRef } from "react";
import * as THREE from "three";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

export default function LensScene() {
  const containerRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // ─── Core setup ───────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // ─── Lights ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x8a93a6, 0.6));

    const emberLight = new THREE.PointLight(0xff6b3d, 18, 30);
    emberLight.position.set(4, 2, 5);
    scene.add(emberLight);

    const glassLight = new THREE.PointLight(0x6fe3d9, 14, 30);
    glassLight.position.set(-4, -2, 5);
    scene.add(glassLight);

    // ─── Signature geometry: nested lens elements ─────────
    const outerGroup = new THREE.Group();
    const outerGeo = new THREE.IcosahedronGeometry(2.3, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xff6b3d,
      emissive: 0xff6b3d,
      emissiveIntensity: 0.25,
      wireframe: true,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerGroup.add(outerMesh);
    scene.add(outerGroup);

    const innerGroup = new THREE.Group();
    const innerGeo = new THREE.OctahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x6fe3d9,
      emissive: 0x6fe3d9,
      emissiveIntensity: 0.3,
      wireframe: true,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerGroup.rotation.set(0.6, 0.3, 0);
    innerGroup.add(innerMesh);
    scene.add(innerGroup);

    // Focal point — small solid core
    const coreGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf3f1ec,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ─── Particle dust field ───────────────────────────────
    const particleCount = 260;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8a93a6,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Mouse parallax ─────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    if (!reducedMotion) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // ─── Resize ──────────────────────────────────────────────
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (reducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    // ─── Animation loop ──────────────────────────────────────
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      outerGroup.rotation.y += 0.0016;
      outerGroup.rotation.x += 0.0006;
      innerGroup.rotation.y -= 0.0022;
      innerGroup.rotation.z += 0.001;
      particles.rotation.y += 0.0004;

      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // ─── Cleanup ──────────────────────────────────────────────
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      {/* Soft bloom-style glow behind the lens */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 60% 45%, rgba(255,107,61,0.18), transparent 40%), radial-gradient(circle at 40% 55%, rgba(111,227,217,0.16), transparent 45%)",
        }}
      />
      <div className="vignette" />
    </div>
  );
}
