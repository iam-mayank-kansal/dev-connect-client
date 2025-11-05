import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

const SocialIcon = ({ platform }: { platform: string }) => {
  const props = { size: 22, className: 'text-gray-500 hover:text-gray-800' };
  switch (platform) {
    case 'GitHub':
      return <Github {...props} />;
    case 'LinkedIn':
      return <Linkedin {...props} />;
    case 'Instagram':
      return <Instagram {...props} />;
    case 'Twitter':
      return <Twitter {...props} />;
    case 'Youtube':
      return <Youtube {...props} />;
    default:
      return <Globe {...props} />;
  }
};

export default SocialIcon;
