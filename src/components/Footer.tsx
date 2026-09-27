const Footer = () => (
  <footer className="py-8 text-center text-footnote text-white/85">
    <p>
      Weather data by{' '}
      <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
        Open-Meteo.com
      </a>{' '}
      (CC BY 4.0) · Geocoding ©{' '}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
        OpenStreetMap contributors
      </a>
    </p>
    <p className="mt-1">© {new Date().getFullYear()} Weatherly</p>
  </footer>
);

export default Footer;
