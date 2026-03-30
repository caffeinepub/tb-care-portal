import { Mail, MapPin, Phone, User } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-[700px] mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-primary mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-10">
        Reach out for support, queries, or feedback related to TB care.
      </p>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
              Name
            </p>
            <p className="font-semibold text-foreground">Sonu Kumar</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
              Email
            </p>
            <a
              href="mailto:sonuamikumar@gmail.com"
              className="font-semibold text-primary hover:underline"
            >
              sonuamikumar@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
              Phone
            </p>
            <a
              href="tel:+918290317570"
              className="font-semibold text-primary hover:underline"
            >
              +91 8290317570
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
              Address
            </p>
            <p className="font-semibold text-foreground">
              GT Road, Ghall Kalan,
              <br />
              Moga, Punjab, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
