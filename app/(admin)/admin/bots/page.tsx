import { dbConnect } from "@/lib/mongodb";
import BotSighting from "@/models/BotSighting";
import { Ghost, ShieldAlert, Search, Clock, Fingerprint } from "lucide-react";

export default async function BotSightingsPage() {
  await dbConnect();
  
  // Fetch the latest 50 bot triggers
  const sightings = await BotSighting.find().sort({ timestamp: -1 }).limit(50);

  return (
    <div className="p-10 bg-slate-50 min-h-screen text-slate-900">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <Ghost className="text-purple-600" /> Scraper Intelligence
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">
            Monitoring automated interactions with hidden tripwires
          </p>
        </div>
        <div className="bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm flex items-center gap-2 text-xs font-bold text-slate-600">
            <ShieldAlert size={14} className="text-amber-500" /> 
            LIVE THREAT DETECTION
        </div>
      </div>

      {/* INTELLIGENCE FEED */}
      <div className="grid gap-6">
        {sightings.map((bot) => (
          <div key={bot._id} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:border-purple-300 transition-all group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Fingerprint size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase tracking-tighter">
                        Unauthorized Crawler
                    </span>
                    <h3 className="text-xl font-mono font-bold mt-1 tracking-tight">{bot.ip}</h3>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-slate-400 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-full">
                  <Clock size={14} />
                  {new Date(bot.timestamp).toLocaleString('en-GB')}
               </div>
            </div>

            {/* User Agent Identification */}
            <div className="mb-6">
               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Reported Identity (User-Agent)</p>
               <div className="bg-slate-50 p-4 border-l-4 border-purple-500 text-sm text-slate-700 italic font-medium">
                  {bot.userAgent}
               </div>
            </div>

            {/* Deep Intelligence Packet */}
            <details className="group/details">
               <summary className="text-[10px] uppercase font-black text-slate-400 cursor-pointer hover:text-purple-600 transition-colors list-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/details:bg-purple-500" />
                  Decrypt Header Packet
               </summary>
               <div className="mt-4 p-6 bg-slate-950 text-cyan-400 rounded-xl overflow-x-auto border border-white/5 font-mono text-[11px] leading-relaxed shadow-inner">
                 <pre>{JSON.stringify(bot.headers, null, 2)}</pre>
               </div>
            </details>
          </div>
        ))}

        {/* EMPTY STATE */}
        {sightings.length === 0 && (
          <div className="py-32 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
            <Ghost className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium italic">The tripwires are quiet. No scrapers detected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}