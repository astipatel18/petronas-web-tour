// components/shared/Footer.tsx
import { Container } from "./Container"

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
          <div className="text-sm text-slate-400">© 2024 PETRONAS TWIN TOWERS. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-8 mt-4 md:mt-0 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-cyan-500">Privacy</a>
            <a href="#" className="hover:text-cyan-500">Terms</a>
            <a href="#" className="hover:text-cyan-500">Safety</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}