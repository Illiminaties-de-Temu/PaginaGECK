// src/components/hero/IASection.jsx
import ServiceSection from '@/components/hero/ServiceSection.jsx'; // ← FALTABA ESTO

export default function IASection() {
  return (
    <ServiceSection
      videoDesktop="/assets/video/ia.mp4"
      videoMobile="/assets/video/ia-movil.mp4"
      poster="/assets/image/ia-poster.jpg"
      title="IA & Automatización"
      description="Desarrollamos soluciones de inteligencia artificial y visión por computadora que transforman tu negocio"
      link="/servicios#ia"
      buttonText="Explorar IA"
    />
  );
}