const express = require('express')
const router = express.Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get all tasks for logged in user
router.get('/', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId]
  )
  res.json(result.rows)
})

// Create task
router.post('/', auth, async (req, res) => {
  const { title, description, status } = req.body
  const result = await pool.query(
    'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, status, req.userId]
  )
  res.json(result.rows[0])
})

// Update task
router.put('/:id', auth, async (req, res) => {
  const { status, title, description } = req.body
  const result = await pool.query(
    'UPDATE tasks SET status = COALESCE($1, status), title = COALESCE($2, title), description = COALESCE($3, description) WHERE id = $4 AND user_id = $5 RETURNING *',
    [status, title, description, req.params.id, req.userId]
  )
  res.json(result.rows[0])
})

// Delete task
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
  res.json({ message: 'Task deleted' })
})

module.exports = router