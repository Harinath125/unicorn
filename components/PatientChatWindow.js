function PatientChatWindow({ therapistName, onSendMessage }) {
  try {
    const [messages, setMessages] = React.useState([
      {
        id: 1,
        sender: 'therapist',
        message: "Hello! How are you feeling today? Have you been practicing the breathing exercises we discussed?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        senderName: therapistName
      },
      {
        id: 2,
        sender: 'patient',
        message: "Hi Dr. Wilson! Yes, I've been doing them every morning. They really help with my anxiety.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        senderName: 'You'
      },
      {
        id: 3,
        sender: 'therapist',
        message: "That's excellent progress! I'm so proud of your commitment. Let's discuss this more in our next session.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        senderName: therapistName
      }
    ]);
    const [newMessage, setNewMessage] = React.useState('');

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      const message = {
        id: Date.now(),
        sender: 'patient',
        message: newMessage,
        timestamp: new Date().toISOString(),
        senderName: 'You'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      if (onSendMessage) {
        await onSendMessage({
          therapistName: therapistName,
          message: newMessage,
          timestamp: new Date().toISOString()
        });
      }
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="card h-96 flex flex-col" data-name="patient-chat-window" data-file="components/PatientChatWindow.js">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Secure Chat with {therapistName}
          </h3>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            ● HIPAA Compliant
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'patient' 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'bg-gray-100 text-[var(--text-primary)]'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'patient' ? 'text-blue-100' : 'text-[var(--text-secondary)]'
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
              placeholder="Type your secure message..."
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
    console.error('PatientChatWindow component error:', error);
    return null;
  }
}