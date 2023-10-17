import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';



function App() {
	const [data, setData] = useState({
		tasks: {},
		columns: {
			'column-1': {
				id: 'column-1',
				title: 'To-do',
				taskIds: [],
			},
		},
		columnOrder: ['column-1'],
	});
	const [newTaskContent, setNewTaskContent] = useState('');
	const [taskIdCounter, setTaskIdCounter] = useState(1);
	useEffect(() => {
		const savedData = localStorage.getItem('tasksData');
		if (savedData) {
			setData(JSON.parse(savedData));
		}
	}, []);
	useEffect(() => {
		localStorage.setItem('tasksData', JSON.stringify(data));
	}, [data]);


	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		const column = data.columns[source.droppableId];
		const newTaskIds = Array.from(column.taskIds);
		newTaskIds.splice(source.index, 1);
		newTaskIds.splice(destination.index, 0, draggableId);

		const newColumn = {
			...column,
			taskIds: newTaskIds,
		};

		const newState = {
			...data,
			columns: {
				...data.columns,
				[newColumn.id]: newColumn,
			},
		};

		setData(newState);
	};

	const handleDeleteTask = (taskId) => {
		const newTasks = { ...data.tasks };
		delete newTasks[taskId];

		const newColumns = { ...data.columns };
		newColumns['column-1'].taskIds = newColumns['column-1'].taskIds.filter(id => id !== taskId);

		setData({
			...data,
			tasks: newTasks,
			columns: newColumns,
		});
	};

	const handleEditTask = (taskId, newContent) => {
		const updatedTask = { ...data.tasks[taskId], content: newContent };
		const newTasks = { ...data.tasks, [taskId]: updatedTask };

		setData({
			...data,
			tasks: newTasks,
		});
	};
	const handleAddTask = () => {
		if (newTaskContent.trim() === '') return;

		const newTaskId = `task-${taskIdCounter}`;
		const newTask = {
			id: newTaskId,
			content: newTaskContent,
		};

		const updatedTasks = {
			...data.tasks,
			[newTaskId]: newTask,
		};

		const updatedColumn = {
			...data.columns['column-1'],
			taskIds: [...data.columns['column-1'].taskIds, newTaskId],
		};

		setData({
			...data,
			tasks: updatedTasks,
			columns: {
				...data.columns,
				'column-1': updatedColumn,
			},
		});

		setTaskIdCounter(taskIdCounter + 1);
		setNewTaskContent('');
	};
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h2>To-do</h2>
				<div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
					<input
						value={newTaskContent}
						onChange={(e) => setNewTaskContent(e.target.value)}
						placeholder="Enter new task"
						style={{ padding: '5px' }}
					/>
					<button onClick={handleAddTask} style={{ padding: '5px 15px' }}>Add Task</button>
				</div>
				{data.columnOrder.map((columnId) => {
					const column = data.columns[columnId];
					const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

					return (
						<Droppable droppableId={column.id} key={column.id}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									style={{ margin: '8px', width: '300px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}
								>
									{tasks.map((task, index) => (
										<Draggable key={task.id} draggableId={task.id} index={index}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<Task
														task={task}
														onDelete={handleDeleteTask}
														onEdit={handleEditTask}
													/>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					);
				})}
			</div>
		</DragDropContext>
	);
}

export default App;
