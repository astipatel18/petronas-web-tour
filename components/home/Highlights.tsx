// components/home/Highlights.tsx
import { Container } from "../shared/Container"
import { Card } from "../ui/card"
import Image from "next/image"

const features = [
  { 
    title: "Skybridge", 
    desc: "Connect with the horizon on level 41 and 42.", 
    img: "https://images.unsplash.com/photo-1595841055318-5089e080753d" // VERIFIED ID
  },
  { 
    title: "Observation Deck", 
    desc: "360 degree views of the golden triangle.", 
    img: "https://images.unsplash.com/photo-1544918877-460635b6d13e" // VERIFIED ID
  },
];

export default function Highlights() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map(f => (
            <Card key={f.title} className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden">
                <Image 
                  src={f.img} 
                  alt={f.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-bold text-white uppercase">{f.title}</h3>
                  <p className="text-slate-300 max-w-xs">{f.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}