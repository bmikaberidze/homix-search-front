import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MessagesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 flex-grow w-full">
      <div className="max-w-[800px] mx-auto">
        {/* Page Header */}
        <h1 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[48px] text-[#110229] mb-2 flex items-center gap-3">
          <MessageCircle className="w-12 h-12 text-[#7065f0]" />
          Messages
        </h1>
        <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[18px] text-[#8f90a6] mb-8">
          All your conversations with property owners
        </p>

        {/* Empty State / Redirect to Chat */}
        <div className="text-center py-16 border-2 border-dashed border-[#f0effb] rounded-[16px]">
          <MessageCircle className="w-16 h-16 text-[#8f90a6] mx-auto mb-4" />
          <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[24px] text-[#110229] mb-2">
            Your messages are in the chat
          </h3>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] mb-6">
            Start conversations with property owners through our AI chat
          </p>
          <Button onClick={() => navigate('/chat', { state: { newConversation: true } })} className="bg-[#7065f0] text-white hover:bg-[#5048c7]">
            Go to Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
