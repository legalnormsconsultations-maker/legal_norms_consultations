import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import { Mail, User, Clock, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Message Checklist | Admin",
};

export default async function MessagesPage() {
  const messages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Message Checklist</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage contact requests from clients.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No messages yet</h3>
            <p className="mt-2">When clients send a message through the contact form, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                      <User size={18} className="text-orange-500" />
                      {msg.fullName}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      <Mail size={16} />
                      <a href={`mailto:${msg.workEmail}`} className="hover:text-orange-600 hover:underline">
                        {msg.workEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 text-xs">
                      <Clock size={14} />
                      {format(new Date(msg.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                  <div className="md:w-2/3 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</h4>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
