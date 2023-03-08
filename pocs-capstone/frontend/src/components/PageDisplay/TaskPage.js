import './PageDisplay.css'
import TabContent from 'react-bootstrap/TabContent'
import Card from 'react-bootstrap/Card';



import Stack from 'react-bootstrap/Stack';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CreateTaskForm from './CreateTaskForm';
import TaskList from './TaskList'
import { useState } from 'react';

const TaskPage = ({ taskList, newTitle, newDesc, newSize, newDate, setAvatarInfo, setInventory, setTaskList, handleCompleteCheck, handleTitleChange, handleDescChange, handleSizeChange, handleDateChange, addTask, deleteTask }) => {
    const [showCreateTask, setShowCreateTask] = useState(false);
    const handleClose = () => setShowCreateTask(false);
    const handleShow = () => setShowCreateTask(true);

    // console.log("??", taskList)
    return (
        <div className="mini-page">
            <Card className='tasklist-position'>
                <Card.Header>
                    <Stack direction="horizontal" gap={3}>
                        <div className='to-do-header'>
                            TO-DO:
                        </div>
                        <div className="ms-auto">
                            <Button variant="primary" onClick={handleShow}>+ Create Task</Button>
                        </div>
                    </Stack>
                </Card.Header>
                <TaskList {...{ taskList, handleCompleteCheck, deleteTask }} />
            </Card>

            <CreateTaskForm {...{ showCreateTask, handleClose, newTitle, newDesc, newSize, newDate, handleTitleChange, handleDescChange, handleSizeChange, handleDateChange, addTask }} />

        </div>
    )
}

export default TaskPage