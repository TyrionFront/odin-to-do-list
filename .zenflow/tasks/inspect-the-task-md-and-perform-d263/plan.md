# To-Do List App — Implementation Plan

Build a frontend To-Do list app per TASK.md requirements with Webpack (dev/prod via webpack-merge), date-fns, and localStorage persistence.

### [x] Step 1: Project setup
- Create .gitignore and package.json
- Set up webpack.common.js, webpack.dev.js, webpack.prod.js (via webpack-merge)

### [x] Step 2: Application logic modules
- src/modules/todo.js — Todo class (title, description, dueDate, priority, notes, complete)
- src/modules/project.js — Project class (name, todos CRUD)
- src/modules/storage.js — localStorage save/load
- src/modules/app.js — App state: projects, active project, CRUD, persistence

### [x] Step 3: UI and entry point
- src/index.html — app shell with sidebar, main area, modal
- src/styles/main.css — clean minimal styles with priority colors
- src/ui/dom.js — all DOM rendering and event handling (separated from logic)
- src/index.js — entry point

### [x] Step 4: Install and verify build
- npm install
- npm run build (verify dist output)
