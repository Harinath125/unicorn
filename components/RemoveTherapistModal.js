function RemoveTherapistModal({ isOpen, onClose, onConfirm, therapist }) {
  try {
    if (!isOpen || !therapist) return null;

    const handleConfirm = () => {
      onConfirm(therapist.objectId);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-name="remove-therapist-modal" data-file="components/RemoveTherapistModal.js">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Remove Therapist</h2>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <div className="icon-alert-triangle text-lg text-red-600"></div>
              </div>
              <div>
                <p className="font-medium text-red-800">Warning: This action cannot be undone</p>
                <p className="text-sm text-red-600">All patient assignments will be affected</p>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] mb-2">You are about to remove:</p>
            <div className="p-3 bg-[var(--secondary-color)] rounded-lg">
              <p className="font-medium text-[var(--text-primary)]">{therapist.objectData.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{therapist.objectData.email}</p>
              <p className="text-sm text-[var(--text-secondary)]">Specialization: {therapist.objectData.specialization}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--secondary-color)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-[var(--danger-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Remove Therapist
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RemoveTherapistModal component error:', error);
    return null;
  }
}