import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const addTask = async () => {
    if (!title.trim()) return
    await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, status: 'todo' })
    })
    setTitle('')
    setDescription('')
    setShowForm(false)
    fetchTasks()
  }

  const updateStatus = async (id: number, status: Task['status']) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    fetchTasks()
  }

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchTasks()
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const columns: { key: Task['status']; label: string; color: string; dot: string; bg: string }[] = [
    { key: 'todo', label: 'To Do', color: 'border-red-400', dot: 'bg-red-400', bg: 'bg-red-50' },
    { key: 'inprogress', label: 'In Progress', color: 'border-yellow-400', dot: 'bg-yellow-400', bg: 'bg-yellow-50' },
    { key: 'done', label: 'Done', color: 'border-green-400', dot: 'bg-green-400', bg: 'bg-green-50' },
  ]

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-lg">TaskFlow</span>
        </div>

        {/* Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <span className="text-white font-semibold text-sm">{user.name?.[0]?.toUpperCase()}</span>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); setShowPasswordModal(true) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Update Password
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">
              {total === 0 ? 'No tasks yet — add one to get started' : `${done} of ${total} tasks completed`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-semibold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Progress Bar */}
        {total > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-6 mt-4">
              {columns.map(col => (
                <div key={col.key} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs text-gray-500">{col.label}: <strong>{tasks.filter(t => t.status === col.key).length}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Task Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-4">New Task</h2>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Task title *"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
            />
            <div className="flex gap-3">
              <button
                onClick={addTask}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
              >
                Add Task
              </button>
              <button
                onClick={() => { setShowForm(false); setTitle(''); setDescription('') }}
                className="text-gray-500 px-6 py-2.5 rounded-xl hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Task Columns */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {columns.map(col => (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${col.dot}`} />
                  <h2 className="font-semibold text-gray-700 text-sm">{col.label}</h2>
                  <span className="ml-auto bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === col.key).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === col.key).length === 0 && (
                    <div className={`${col.bg} border-2 border-dashed ${col.color} rounded-2xl p-6 text-center`}>
                      <p className="text-gray-400 text-xs">No tasks here</p>
                    </div>
                  )}
                  {tasks.filter(t => t.status === col.key).map(task => (
                    <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm leading-snug flex-1 pr-2">{task.title}</h3>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-300 hover:text-red-400 transition flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{task.description}</p>
                      )}
                      <select
                        className="w-full text-xs border border-gray-100 rounded-lg p-1.5 bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={task.status}
                        onChange={e => updateStatus(task.id, e.target.value as Task['status'])}
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="font-bold text-gray-800 mb-1">Update Password</h2>
            <p className="text-sm text-gray-400 mb-4">Enter your new password below</p>

            {passwordMsg && (
              <div className={`text-sm p-3 rounded-xl mb-4 ${passwordMsg.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {passwordMsg}
              </div>
            )}

            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!newPassword || newPassword.length < 6) {
                    setPasswordMsg('Password must be at least 6 characters')
                    return
                  }
                  try {
                    const res = await fetch('http://localhost:5000/api/auth/update-password', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ password: newPassword })
                    })
                    if (res.ok) {
                      setPasswordMsg('Password updated successfully!')
                      setNewPassword('')
                      setTimeout(() => { setShowPasswordModal(false); setPasswordMsg('') }, 1500)
                    } else {
                      setPasswordMsg('Failed to update password')
                    }
                  } catch {
                    setPasswordMsg('Server error')
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => { setShowPasswordModal(false); setNewPassword(''); setPasswordMsg('') }}
                className="flex-1 text-gray-500 py-2.5 rounded-xl hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}