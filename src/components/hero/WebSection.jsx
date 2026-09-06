// WebSection.jsx
import ServiceSection from './ServiceSection';

export default function WebSection() {
  return (
    <ServiceSection
      videoDesktop="/assets/video/web.mp4"
      videoMobile="/assets/video/web-movil.mp4"
      poster="/assets/image/web-poster.webp"
      title="Desarrollo Web"
      description="Creamos aplicaciones web modernas, rápidas y escalables con las mejores tecnologías del mercado"
      link="/servicios/a-medida/#web"  // ← AGREGAR HASH
      buttonText="Explorar Web"
    />
  );
}