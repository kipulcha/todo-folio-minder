# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/20ceb488-422d-43cc-924b-5349227db56f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/20ceb488-422d-43cc-924b-5349227db56f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/20ceb488-422d-43cc-924b-5349227db56f) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

Sequential Diagram:
    participant User
    participant TaskList
    participant TaskItem
    participant TaskForm
    participant TaskContext
    participant LocalStorage

    Note over User,LocalStorage: Task Creation Flow
    User->>TaskList: Clicks "New Task" button
    TaskList->>TaskContext: toggleForm(true)
    TaskContext->>TaskForm: Updates isFormOpen state to true
    TaskForm->>User: Displays task creation form
    User->>TaskForm: Fills in task details and submits
    TaskForm->>TaskContext: addTask(taskData)
    TaskContext->>TaskContext: Creates task with ID and timestamps
    TaskContext->>LocalStorage: Saves updated tasks array
    TaskContext->>TaskForm: Closes form
    TaskForm->>TaskList: Re-renders with new task

    Note over User,LocalStorage: Task Update Flow
    User->>TaskItem: Clicks on task to edit
    TaskItem->>TaskContext: selectTask(taskId)
    TaskContext->>TaskForm: Opens form with selected task
    TaskForm->>User: Displays form with task data
    User->>TaskForm: Updates fields and submits
    TaskForm->>TaskContext: updateTask(taskData)
    TaskContext->>LocalStorage: Saves updated task
    TaskContext->>TaskList: Re-renders with updated task

    Note over User,LocalStorage: Drag and Drop Flow
    User->>TaskItem: Starts dragging a task
    TaskItem->>TaskItem: handleDragStart stores taskId
    User->>TaskList: Drags to different status column
    TaskList->>TaskList: handleDrop receives taskId and newStatus
    TaskList->>TaskContext: updateTask with new status
    TaskContext->>LocalStorage: Saves task with updated status
    TaskContext->>TaskList: Re-renders columns with moved task

    Note over User,LocalStorage: Task Deletion Flow
    User->>TaskItem: Clicks delete button
    TaskItem->>TaskContext: deleteTask(taskId)
    TaskContext->>TaskContext: Removes task from tasks array
    TaskContext->>LocalStorage: Saves updated tasks array
    TaskContext->>TaskList: Re-renders without deleted task

    Note over User,LocalStorage: Data Persistence
    TaskContext->>LocalStorage: Saves tasks on any state change
    TaskContext->>LocalStorage: Loads tasks on initial render

