function ChatWindow({ patient, onSendMessage }) {
  try {
    const [messages, setMessages] = React.useState([
      {
        id: 1,
        sender: 'patient',
        message: "Hi Dr. Wilson, I've been practicing the breathing exercises you taught me.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        senderName: patient?.objectData?.name || 'Patient'
      },
      {
        id: 2,
        sender: 'therapist',
        message: "That's wonderful to hear! How have you been feeling since we started the exercises?",
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        senderName: 'You'
      },
      {
        id: 3,
        sender: 'patient',
        message: "Much better actually. The anxiety levels have decreased significantly, especially during work meetings.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        senderName: patient?.objectData?.name || 'Patient'
      }
    ]);
    const [newMessage, setNewMessage] = React.useState('');

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      const message = {
        id: Date.now(),
        sender: 'therapist',
        message: newMessage,
        timestamp: new Date().toISOString(),
        senderName: 'You'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      if (onSendMessage) {
        await onSendMessage({
          patientId: patient?.objectId,
          message: newMessage,
          timestamp: new Date().toISOString()
        });
      }
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="card h-96 flex flex-col" data-name="chat-window" data-file="components/ChatWindow.js">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Chat with {patient?.objectData?.name || 'Patient'}
          </h3>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            ● Online
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'therapist' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'therapist' 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'bg-gray-100 text-[var(--text-primary)]'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'therapist' ? 'text-blue-100' : 'text-[var(--text-secondary)]'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="pt-4 border-t border-[var(--border-color)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn btn-primary"
            >
              <div className="icon-send text-lg"></div>
            </button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('ChatWindow component error:', error);
    return null;
  }
}