import React, { useState } from 'react';

const Task = ({ task, onDelete, onEdit }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(task.content);

	const handleEdit = () => {
		onEdit(task.id, editValue);
		setIsEditing(false);
	};

	return (
		<div style={{ border: '1px solid black', padding: '8px', marginBottom: '8px' }}>
			{isEditing ? (
				<>
					<input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
					<button onClick={handleEdit}>Save</button>
				</>
			) : (
				<>
					{task.content}
					<button onClick={() => setIsEditing(true)}>Edit</button>
				</>
			)}
			<button onClick={() => onDelete(task.id)}>Delete</button>
		</div>
	);
};

export default Task;
