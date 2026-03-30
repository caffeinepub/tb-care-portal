import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  Pill,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: <UserPlus className="w-7 h-7" />,
    label: "Patient Registration",
    href: "/patient",
    color: "text-primary",
  },
  {
    icon: <ClipboardList className="w-7 h-7" />,
    label: "Questionnaire",
    href: "/questionnaire",
    color: "text-accent",
  },
  {
    icon: <Pill className="w-7 h-7" />,
    label: "DR-TB Info",
    href: "/resistance",
    color: "text-primary",
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    label: "Counselling Tips",
    href: "#tips",
    color: "text-accent",
  },
];

const tips = [
  "Complete the full course of treatment without interruption",
  "Avoid alcohol as it interferes with TB medications",
  "Take drugs daily at the same time each day",
  "Eat nutritious, balanced meals to support recovery",
  "Visit your doctor regularly for follow-up appointments",
];

const quickActions = [
  {
    title: "Register a New Patient",
    desc: "Add patient drug details including medication name and dosage frequency.",
    href: "/patient",
    cta: "Register Patient",
  },
  {
    title: "Complete Questionnaire",
    desc: "Record patient adherence status including missed doses and side effects.",
    href: "/questionnaire",
    cta: "Start Questionnaire",
  },
];

export default function HomePage() {
  const router = useRouter();
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[500px] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/tb-portal-hero.dim_1400x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(15,28,36,0.85) 40%, rgba(15,28,36,0.3) 100%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Tuberculosis Care Portal
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Comprehensive care management for TB patients — empowering
              healthcare providers with modern digital tools.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                size="lg"
                onClick={() => router.navigate({ to: "/patient" })}
                data-ocid="hero.primary_button"
                className="bg-primary hover:bg-primary/90 text-white font-semibold"
              >
                Register a Patient
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.navigate({ to: "/resistance" })}
                data-ocid="hero.secondary_button"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                View Drug Info
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portal Services */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-10 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-card border-border">
            <CardContent className="py-8">
              <h2 className="text-xl font-bold text-center text-foreground mb-8">
                Portal Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {services.map((s) => (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() =>
                      s.href.startsWith("#")
                        ? document
                            .querySelector(s.href)
                            ?.scrollIntoView({ behavior: "smooth" })
                        : router.navigate({ to: s.href })
                    }
                    data-ocid="services.button"
                    className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-secondary transition-colors group cursor-pointer"
                  >
                    <div
                      className={`${s.color} bg-secondary p-3 rounded-full group-hover:scale-110 transition-transform`}
                    >
                      {s.icon}
                    </div>
                    <span className="text-sm font-medium text-center text-foreground">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Counselling Tips */}
      <section
        id="tips"
        className="py-16"
        style={{ background: "oklch(0.94 0.02 210)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Counselling Tips
            </h2>
            <p className="text-muted-foreground mb-8">
              Essential guidance for TB patients and their caregivers.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((tip, i) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="shadow-xs border-border h-full">
                    <CardContent className="p-5 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground font-medium">
                        {tip}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {quickActions.map((item) => (
            <Card
              key={item.href}
              className="shadow-card border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.desc}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.navigate({ to: item.href })}
                  data-ocid="action.button"
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  {item.cta} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
