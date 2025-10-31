function SOAPNoteModal({ isOpen, onClose, onSubmit, patientName = '' }) {
  try {
    const [formData, setFormData] = React.useState({
      patientName: patientName,
      sessionDate: new Date().toISOString().split('T')[0],
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
      if (patientName) {
        setFormData(prev => ({ ...prev, patientName }));
      }
    }, [patientName]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const soapNote = {
          ...formData,
          createdAt: new Date().toISOString(),
          id: Date.now().toString()
        };
        await onSubmit(soapNote);
        setFormData({ 
          patientName: '', 
          sessionDate: new Date().toISOString().split('T')[0],
          subjective: '', objective: '', assessment: '', plan: '' 
        });
        onClose();
      } catch (error) {
        console.error('Error creating SOAP note:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-name="soap-note-modal" data-file="components/SOAPNoteModal.js">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">New SOAP Note</h2>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Session Date</label>
                <input
                  type="date"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Subjective <span className="text-xs text-[var(--text-secondary)]">(Patient's reported symptoms/concerns)</span>
              </label>
              <textarea
                name="subjective"
                value={formData.subjective}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none resize-none"
                placeholder="Patient reports feeling anxious about upcoming work presentation..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Objective <span className="text-xs text-[var(--text-secondary)]">(Observable behaviors/symptoms)</span>
              </label>
              <textarea
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none resize-none"
                placeholder="Patient appeared tense, maintained good eye contact, speech was clear..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Assessment <span className="text-xs text-[var(--text-secondary)]">(Clinical judgment/diagnosis)</span>
              </label>
              <textarea
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none resize-none"
                placeholder="Patient shows signs of situational anxiety related to work stress..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Plan <span className="text-xs text-[var(--text-secondary)]">(Treatment plan/next steps)</span>
              </label>
              <textarea
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none resize-none"
                placeholder="Continue weekly sessions, assign breathing exercises, schedule follow-up..."
                required
              ></textarea>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--secondary-color)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn btn-primary justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save SOAP Note'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SOAPNoteModal component error:', error);
    return null;
  }
}