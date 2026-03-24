// components/home/CTA.tsx
import { Container } from "../shared/Container"
import { Button } from "../ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-24 bg-cyan-600">
      <Container className="text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">READY TO TOUCH THE SKY?</h2>
        <Link href="/booking">
          <Button variant="primary" className="bg-black text-white border-black hover:bg-slate-900">Get Your Tickets Now</Button>
        </Link>
      </Container>
    </section>
  )
}