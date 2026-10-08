"use client";

import { useState, useEffect } from "react";
import { PhoneCall, Mail, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/app/actions/settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const InstagramIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const XIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);
const LinkedinIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const DiscordIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
);

export function ContactModal({ children, mode = "all" }: { children: React.ReactElement; mode?: "call" | "chat" | "all" }) {
  const [settings, setSettings] = useState<any>(null);
  const [showCallConfirm, setShowCallConfirm] = useState(false);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data) setSettings(data);
    });
  }, []);

  useEffect(() => {
    // If opened in call mode, and we have a number, we can show confirm directly or just show the single list item.
    // The user wants "sirf dadicated call numbers ke section ko hi rakho". We'll just filter the view.
    if (mode === "call") {
      setShowCallConfirm(false);
    }
  }, [mode]);

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCallConfirm(true);
  };

  const handleConfirmCall = () => {
    setShowCallConfirm(false);
    if (settings?.contactNumber) {
      window.location.href = `tel:${settings.contactNumber.replace(/[^0-9+]/g, '')}`;
    }
  };

  return (
    <Dialog onOpenChange={(open) => { if (!open) setShowCallConfirm(false); }}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {!showCallConfirm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {mode === "call" ? "Schedule a Call" : mode === "chat" ? "Connect With Us" : "Contact Us"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 py-4 scrollbar-thin">
              {(!settings?.contactNumber && !settings?.email && !settings?.whatsappNumber && !settings?.instagramUrl && !settings?.facebookUrl && !settings?.xUrl && !settings?.linkedinUrl && !settings?.discordUrl) && (
                <div className="text-center p-6 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p>Contact information has not been configured yet.</p>
                  <p className="text-sm mt-2">Please update it from the admin settings.</p>
                </div>
              )}
              
              <div className="flex flex-col gap-6">
                {(mode === "all" || mode === "call") && settings?.contactNumber && (
                  <button 
                    onClick={handleCallClick}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-orange-100 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all text-center group"
                  >
                    <div className="bg-orange-600 text-black dark:text-white p-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                      <PhoneCall size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">Call Us Directly</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{settings.contactNumber}</p>
                    </div>
                  </button>
                )}
                
                {(mode === "all" || mode === "chat") && (
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 justify-items-center mt-2">
                    {settings?.whatsappNumber && (
                      <a 
                        href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-[#25D366]/10 text-[#25D366] p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <MessageCircle size={28} />
                        </div>
                      </a>
                    )}
                    
                    {settings?.email && (
                      <a 
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.email.trim())}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-amber-100 text-amber-600 p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <Mail size={28} />
                        </div>
                      </a>
                    )}

                    {settings?.instagramUrl && (
                      <a 
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <InstagramIcon className="w-7 h-7" />
                        </div>
                      </a>
                    )}

                    {settings?.facebookUrl && (
                      <a 
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-[#1877F2]/10 text-[#1877F2] p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <FacebookIcon className="w-7 h-7" />
                        </div>
                      </a>
                    )}

                    {settings?.xUrl && (
                      <a 
                        href={settings.xUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-slate-100 text-black dark:bg-slate-800 dark:text-white p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <XIcon className="w-7 h-7" />
                        </div>
                      </a>
                    )}

                    {settings?.linkedinUrl && (
                      <a 
                        href={settings.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-[#0A66C2]/10 text-[#0A66C2] p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <LinkedinIcon className="w-7 h-7" />
                        </div>
                      </a>
                    )}

                    {settings?.discordUrl && (
                      <a 
                        href={settings.discordUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group w-full"
                      >
                        <div className="bg-[#5865F2]/10 text-[#5865F2] p-3.5 rounded-full group-hover:scale-110 transition-transform">
                          <DiscordIcon className="w-7 h-7" />
                        </div>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Confirm Call</DialogTitle>
            </DialogHeader>
            <div className="py-8 text-center space-y-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600 animate-pulse">
                <PhoneCall size={40} />
              </div>
              <div>
                <p className="text-lg text-slate-700 dark:text-slate-300">Start a call with</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{settings?.contactNumber}</p>
              </div>
              <div className="flex gap-4 justify-center mt-8">
                <button 
                  onClick={() => setShowCallConfirm(false)}
                  className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition w-32"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmCall}
                  className="px-6 py-3 rounded-xl bg-orange-600 text-black dark:text-white font-medium hover:bg-orange-700 transition shadow-md w-32"
                >
                  Call Now
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
