import { WhatsappIcon } from "@/components/Icons";
import { getGeneralWhatsappLink } from "@/lib/whatsapp";

export default function WhatsappFloat() {
  return (
    <a href={getGeneralWhatsappLink()} className="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with MJ Sports on WhatsApp">
      <WhatsappIcon size={28} />
    </a>
  );
}
