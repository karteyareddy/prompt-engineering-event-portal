'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Users, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Hyperspeed from '@/components/Hyperspeed'

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/30">

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
              ClubEvent
            </div>
            <div className="flex gap-2 md:gap-4">
              <Link href="/login" className="px-3 py-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                Login
              </Link>
              <Link href="/register" className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-background bg-primary hover:bg-primary/90 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-105">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Hyperspeed
            effectOptions={{
              distortion: "turbulentDistortion",
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 3,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 20,
              lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.03, 400 * 0.2],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono tracking-wider mb-8 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              REGISTRATION OPEN
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
              The Ultimate <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-pulse">
                Prompt Engineering Experience
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed font-light">
              Join the biggest tech summit of the year. Hackathons, workshops, and networking. All in one seamless platform.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/register" className="group px-8 py-4 text-lg font-bold text-background bg-primary hover:bg-primary/90 rounded-full shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all flex items-center gap-2 hover:scale-105">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#details" className="px-8 py-4 text-lg font-medium text-foreground hover:bg-white/5 border border-white/10 rounded-full transition-all hover:border-primary/50">
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements - Glowing Orbs */}
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Event Details Section */}
      <section id="details" className="py-24 bg-black/20 relative">
        <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 font-mono tracking-tight uppercase">Event Details</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={item} className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background transition-colors shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-mono">WHEN</h3>
              <p className="text-muted-foreground">
                Tuesday, February 10th, 2026<br />
                10:00 AM - 6:00 PM
              </p>
            </motion.div>
            <motion.div variants={item} className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/5 hover:border-secondary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-background transition-colors shadow-[0_0_15px_rgba(var(--secondary),0.2)]">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-mono">WHERE</h3>
              <p className="text-muted-foreground">
                8th Block (or) Harry Potter Block<br />
                Seminar Hall
              </p>
            </motion.div>
            <motion.div variants={item} className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/5 hover:border-accent/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-background transition-colors shadow-[0_0_15px_rgba(var(--accent),0.2)]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-mono">PARTICIPATION</h3>
              <p className="text-muted-foreground">
                Teams of 3-5 Members<br />
                Open for all innovators
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card/30 backdrop-blur-md border border-white/10 text-foreground rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Animated border gradient effect (simplified with CSS) */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50 pointer-events-none"></div>

            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 relative z-10 font-mono uppercase tracking-wider">
              <ShieldCheck className="w-8 h-8 text-primary" />
              Protocol Rules
            </h2>

            <ul className="space-y-6 relative z-10">
              <li className="flex items-start gap-4 group">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold mt-0.5 group-hover:bg-primary group-hover:text-background transition-colors font-mono">01</span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Each team must have a minimum of 3 and maximum of 5 members.</span>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold mt-0.5 group-hover:bg-primary group-hover:text-background transition-colors font-mono">02</span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Registration fee must be paid in full and screenshot uploaded for validation.</span>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold mt-0.5 group-hover:bg-primary group-hover:text-background transition-colors font-mono">03</span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Access tokens (QR) will be generated only after admin verification.</span>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold mt-0.5 group-hover:bg-primary group-hover:text-background transition-colors font-mono">04</span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Attendance is mandatory during the specified time window.</span>
              </li>
            </ul>

            <div className="mt-12 text-center">
              <Link href="/register" className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full hover:bg-secondary/90 transition-all shadow-[0_0_20px_rgba(var(--secondary),0.4)] hover:scale-105">
                Initialize Team Registration
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12 border-t border-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="font-mono text-sm">© 2026 ClubEvent [SYSTEM ONLINE]</p>
        </div>
      </footer>
    </div>
  )
}
