function AssignExerciseModal({ isOpen, onClose, onSubmit, patients = [] }) {
  try {
    const [formData, setFormData] = React.useState({
      patientId: '',
      exerciseType: '',
      title: '',
      description: '',
      duration: 15,
      frequency: 'daily',
      instructions: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const exerciseAssignment = {
          ...formData,
          createdAt: new Date().toISOString(),
          id: Date.now().toString(),
          status: 'assigned'
        };
        await onSubmit(exerciseAssignment);
        setFormData({ 
          patientId: '', exerciseType: '', title: '', description: '',
          duration: 15, frequency: 'daily', instructions: ''
        });
        onClose();
      } catch (error) {
        console.error('Error assigning exercise:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const exerciseTypes = [
      { value: 'breathing', label: 'Breathing Exercises' },
      { value: 'meditation', label: 'Mindfulness Meditation' },
      { value: 'cognitive', label: 'Cognitive Restructuring' },
      { value: 'relaxation', label: 'Progressive Muscle Relaxation' },
      { value: 'grounding', label: 'Grounding Techniques' },
      { value: 'journaling', label: 'Therapeutic Journaling' }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-name="assign-exercise-modal" data-file="components/AssignExerciseModal.js">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Assign Exercise</h2>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Select Patient</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                  required
                >
                  <option value="">Choose a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.objectId} value={patient.objectId}>
                      {patient.objectData.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Exercise Type</label>
                <select
                  name="exerciseType"
                  value={formData.exerciseType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select exercise type</option>
                  {exerciseTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
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
                    Assigning...
                  </>
                ) : (
                  'Assign Exercise'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AssignExerciseModal component error:', error);
    return null;
  }
}