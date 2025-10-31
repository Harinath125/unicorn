function ClinicList({ clinics, onEdit, onDelete }) {
  try {
    return (
      <div className="card" data-name="clinic-list" data-file="components/ClinicList.js">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">All Clinics</h3>
          <span className="text-sm text-[var(--text-secondary)]">{clinics.length} total</span>
        </div>

        <div className="space-y-3">
          {clinics.length === 0 ? (
            <div className="text-center py-8">
              <div className="icon-building-2 text-4xl text-[var(--text-secondary)] mb-2"></div>
              <p className="text-[var(--text-secondary)]">No clinics found</p>
            </div>
          ) : (
            clinics.map((clinic) => (
              <div key={clinic.objectId} className="flex items-center justify-between p-4 bg-[var(--secondary-color)] rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-[var(--text-primary)]">{clinic.objectData.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      clinic.objectData.status === 'active' ? 'bg-green-100 text-green-700' :
                      clinic.objectData.status === 'inactive' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {clinic.objectData.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{clinic.objectData.address}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{clinic.objectData.email} • {clinic.objectData.phone}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(clinic)}
                    className="p-2 text-[var(--primary-color)] hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit clinic"
                  >
                    <div className="icon-edit text-lg"></div>
                  </button>
                  <button
                    onClick={() => onDelete(clinic.objectId)}
                    className="p-2 text-[var(--danger-color)] hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete clinic"
                  >
                    <div className="icon-trash-2 text-lg"></div>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ClinicList component error:', error);
    return null;
  }
}