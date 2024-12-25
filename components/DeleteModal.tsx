type DeleteModalProps = {
    isOpen: boolean
    onDelete: () => void
    onCancel: () => void
  }
  
  export default function DeleteModal({ isOpen, onDelete, onCancel }: DeleteModalProps) {
    return (
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to delete this confession?</h3>
          <div className="modal-action">
            <button className="btn btn-error" onClick={onDelete}>Yes, Delete</button>
            <button className="btn" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
  