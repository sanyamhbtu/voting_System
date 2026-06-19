
import { useEffect, useState } from 'react';
import {useWebSocket, API_URL } from '../../../utils/util'
import { BadgeCheck  } from 'lucide-react';
import axios from 'axios';
type MESSAGES = {
  name : string;
  party : string;
  hash : string;
  time : string;
}
export default function Broadcasting () {
    const [messages, setMessages] = useState<MESSAGES[]>([]);
    useEffect(() => {
      const getMessages = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/v4/getMessages`);
          if (response.status === 200) {
            setMessages(response.data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      getMessages();
      console.log(messages)
    }, []);
    const newMessage = useWebSocket();
  
    useEffect(() => {
      if (newMessage) {
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    }, [newMessage]);
  
    return (
        <div className="glass rounded-3xl p-6 h-full">
          <h2 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse-glow" />
            Live Voting Feed
          </h2>
          <div className="space-y-3 h-[30vw] overflow-y-auto pr-1">
            {messages.map((message, i) => (
              <div key={i} className="flex items-start space-x-4 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center flex-shrink-0 glow">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className='flex items-center justify-between w-full gap-2'>
                        <span className="text-white font-medium truncate">{message.name} </span>
                        <span className="text-cyber-300 font-medium text-xs rounded-full border border-cyber-400/30 bg-cyber-500/10 px-2 py-0.5 whitespace-nowrap">{message.party}</span>
                    </div>
                  <p className="text-sm text-white/45 truncate">{message.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    )
}