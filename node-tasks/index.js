import fs from 'fs' // file system
import path from 'path' // path
import readline from 'readline' // read line
import { fileURLToPath } from 'url' // __filename and __dirname needs this to work in ES modules

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create an interface to read user input
const inputInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const listTasks = () => {
	const tasks = fs.readFileSync(path.join(__dirname, 'tasks.txt')).toString()
	console.log('\n****************\n')
	console.log(tasks)
	console.log('****************\n')
}

// Callback function to handle adding new task
const handleAddingNewTask = (newTask) => {
	const tasks = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
	)

	const id = tasks.length !== 0 ? [...tasks].pop().id + 1 : 1

	tasks.push({
		id: id,
		task: newTask,
		completed: false,
	})

	fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(tasks))
	const taskString = `${tasks[tasks.length - 1].id}: ${
		tasks[tasks.length - 1].task
	} -- ${tasks[tasks.length - 1].completed ? '✓' : '✗'} \n`

	fs.appendFileSync(path.join(__dirname, 'tasks.txt'), taskString)

	console.log('\n****************\n')
	console.log(`Added task: ${newTask}\n`)
	console.log('****************\n')
}

// Function that calls the askQuestion as its callback for adding a task
const addTask = () => {
	askQuestion('Enter new task\n', handleAddingNewTask)
}

const rewriteTasksTXT = () => {
	const tasks = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
	)
	fs.writeFileSync(path.join(__dirname, 'tasks.txt'), '')

	tasks.forEach((task) => {
		const taskString = `${task.id}: ${task.task} -- ${
			task.completed ? '✓' : '✗'
		} \n`
		fs.appendFileSync(path.join(__dirname, 'tasks.txt'), taskString)
	})
}

// Callback function to handle marking task as completed
const handleMarkingTaskAsCompleted = (id) => {
	const tasks = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
	)

	tasks.map((task) => {
		if (task.id == id) {
			task.completed = true
		}
	})

	fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(tasks))
	rewriteTasksTXT()
}

// Function that calls the askQuestion as its callback for marking a task
const markTaskAsCompleted = () => {
	askQuestion(
		'Enter the task id that you want to mark as completed\n',
		handleMarkingTaskAsCompleted
	)
}

// Callback function to handle deleting task
const handleDeletingTask = (id) => {
	const tasks = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
	)

	tasks.map((task) => {
		if (task.id == id) {
			tasks.splice(tasks.indexOf(task), 1)
		}
	})

	fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(tasks))

	rewriteTasksTXT()
}

// Function that calls the askQuestion as its callback for deleting a task
const deleteTask = () => {
	askQuestion(
		'Enter the task id that you want to delete\n',
		handleDeletingTask
	)
}

// Clears all data

const clearAllData = async () => {
	await fs.promises.writeFileSync(path.join(__dirname, 'data.json'), '[]')
	await fs.promises.writeFileSync(path.join(__dirname, 'tasks.txt'), '')
}

// Driver code
const main = () => {
	askQuestion(
		'📖 Enter 1 to list all tasks\n➕ Enter 2 to add a new task\n✅ Enter 3 to mark a task as completed\n❌ Enter 4 to delete a task\n⏹️  Enter 5 to exit\n',
		handleInput
	)
}

// Function that gets the user input and calls the callback
const askQuestion = (question, callback) => {
	inputInterface.question(question, callback)
}

// Callback function to handle user input
const handleInput = (input) => {
	const choice = parseInt(input)

	switch (choice) {
		case 1:
			listTasks()
			break
		case 2:
			addTask()
			break
		case 3:
			markTaskAsCompleted()
			break
		case 4:
			deleteTask()
			break
		case 5:
			console.log('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌')
			console.log('Exited and reset all data')
			console.log('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌')
			clearAllData()
			process.exit(0)
		default:
			console.log('Invalid input')
	}

	// Ask the next question recursively
	if (choice < 5) {
		main()
	}
}

main();