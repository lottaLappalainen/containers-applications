const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const currentCount = parseInt((await getAsync('added_todos')) || '0', 10);
  await setAsync('added_todos', currentCount + 1);
  res.send(todo);
});

/* GET statistics. */
router.get('/statistics', async (req, res) => {
  const addedTodos = parseInt((await getAsync('added_todos')) || '0', 10);
  res.json({ added_todos: addedTodos });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    req.todo.text = req.body.text ?? req.todo.text;
    req.todo.done = req.body.done ?? req.todo.done;

    const updatedTodo = await req.todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update todo' });
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
