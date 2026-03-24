import Link from "next/link";
import { Container } from "@/components/shared/Container";

export default function NotFound() {
  return (
    <main className="h-screen bg-deep-slate flex items-center justify-center text-center">
      <Container>
        <h1 className="text-9xl font-serif text-white/10 absolute inset-0 flex items-center justify-center pointer-events-none">404</h1>
        <div className="relative z-10">
          <h2 className="text-4xl font-serif italic text-white mb-6">Lost Above the Clouds</h2>
          <p className="text-slate-500 mb-12 max-w-md mx-auto">
            The page you are looking for has drifted into the horizon. 
            Let us guide you back to the ground floor.
          </p>
          <Link href="/" className="bg-white text-black px-10 py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-cyan-500 transition-all">
            Return to Earth
          </Link>
        </div>
      </Container>
    </main>
  );
}