import { useState } from 'react'
import {
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  Flame,
  House,
  Plus,
  Star,
  Trash2,
  Zap,
} from 'lucide-react'

const filters = [
  { id: 'all', label: 'All Tasks', icon: House },
  { id: 'completed', label: 'Completed', icon: CircleCheck },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'important', label: 'Important', icon: Star },
]

function TodoList() {
  const [taskText, setTaskText] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Finish the portfolio design',
      due: 'Today · 10:00 AM',
      completed: true,
      important: true,
    },
    {
      id: 2,
      text: 'Build the projects section',
      due: 'Today · 2:00 PM',
      completed: false,
      important: false,
    },
    {
      id: 3,
      text: 'Update my resume',
      due: 'Tomorrow · 11:00 AM',
      completed: false,
      important: false,
    },
    {
      id: 4,
      text: 'Write blog post',
      due: 'Yesterday · 6:30 PM',
      completed: true,
      important: false,
    },
    {
      id: 5,
      text: 'Learn advanced React patterns',
      due: 'This week',
      completed: false,
      important: true,
    },
  ])

  const completedCount = tasks.filter((task) => task.completed).length
  const remainingCount = tasks.length - completedCount
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'completed') return task.completed
    if (activeFilter === 'today') return task.due.startsWith('Today')
    if (activeFilter === 'important') return task.important
    return true
  })

  function addTask(event) {
    event.preventDefault()
    const text = taskText.trim()

    if (!text) return

    setTasks((currentTasks) => [
      {
        id: Date.now(),
        text,
        due: 'Today · Just added',
        completed: false,
        important: false,
      },
      ...currentTasks,
    ])
    setTaskText('')
    setActiveFilter('all')
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function toggleImportant(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, important: !task.important } : task,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  function countForFilter(filterId) {
    if (filterId === 'completed') return completedCount
    if (filterId === 'today') {
      return tasks.filter((task) => task.due.startsWith('Today')).length
    }
    if (filterId === 'important') {
      return tasks.filter((task) => task.important).length
    }
    return tasks.length
  }

  return (
    <div className="todo-workspace">
      <aside className="todo-sidebar" aria-label="Task categories">
        <div className="todo-sidebar-brand">
          <span className="todo-brand-icon"><Check size={20} /></span>
          <span>
            <strong>Todo</strong>
            <small>Small tasks. Big progress.</small>
          </span>
        </div>

        <nav className="todo-filter-list" aria-label="Filter tasks">
          {filters.map(({ id, label, icon: Icon }) => (
            <button
              className={`todo-filter ${activeFilter === id ? 'is-active' : ''}`}
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              aria-pressed={activeFilter === id}
            >
              <Icon size={20} />
              <span>{label}</span>
              <span className="todo-filter-count">{countForFilter(id)}</span>
            </button>
          ))}
        </nav>

        <div className="todo-encouragement">
          <Zap size={20} />
          <strong>Keep going!</strong>
          <p>You&apos;re doing great. Small steps create big results.</p>
          <div className="todo-encouragement-art" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </aside>

      <div className="todo-main">
        <form className="todo-compose" onSubmit={addTask}>
          <label className="todo-compose-icon" htmlFor="todo-compose-input">
            <Plus size={20} />
          </label>
          <input
            id="todo-compose-input"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
          />
          <button className="todo-add-button" type="submit">Add</button>
        </form>

        <div className="todo-list-heading">
          <h3>Your Tasks</h3>
          <span>{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}</span>
          <label className="todo-sort">
            <span className="todo-visually-hidden">Task filter</span>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
            >
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id}>{filter.label}</option>
              ))}
            </select>
          </label>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="todo-empty">No tasks here yet. Add one to get started.</p>
        ) : (
          <ul className="todo-task-list">
            {filteredTasks.map((task) => (
              <li className="todo-task" key={task.id}>
                <button
                  className={`todo-task-check ${task.completed ? 'is-complete' : ''}`}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? `Mark ${task.text} incomplete` : `Complete ${task.text}`}
                >
                  {task.completed && <Check size={16} />}
                </button>
                <span className="todo-task-copy">
                  <span className={task.completed ? 'is-complete' : ''}>{task.text}</span>
                  <small>{task.due}</small>
                </span>
                <button
                  className={`todo-task-important ${task.important ? 'is-important' : ''}`}
                  type="button"
                  onClick={() => toggleImportant(task.id)}
                  aria-label={task.important ? `Remove ${task.text} from important` : `Mark ${task.text} important`}
                  aria-pressed={task.important}
                >
                  <Star size={19} />
                </button>
                <button
                  className="todo-task-delete"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                >
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="todo-progress" aria-label="Task progress">
        <div className="todo-progress-toggle" aria-hidden="true">
          <span>☼</span><span className="todo-toggle-track"><i /></span><span>☾</span>
        </div>

        <div className="todo-progress-art" aria-hidden="true">
          <span className="todo-art-star">✦</span>
          <span className="todo-art-planet"><span /></span>
          <span className="todo-art-sparkle">✧</span>
        </div>

        <blockquote>
          “Progress is better than perfection.”
          <span />
        </blockquote>

        <div className="todo-stats">
          <div>
            <CalendarDays size={19} />
            <span>Total tasks</span>
            <strong>{tasks.length}</strong>
          </div>
          <div>
            <CircleCheck size={19} />
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div>
            <Clock3 size={19} />
            <span>Remaining</span>
            <strong>{remainingCount}</strong>
          </div>
        </div>

        <span className="todo-focus-hint">
          <Flame size={15} /> One step at a time
        </span>
      </aside>
    </div>
  )
}

export default TodoList
