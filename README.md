# Note Taking Application

Welcome to participate in this test. Please read the following instruction and complete the tasks below.

## About This App
A Simple Notes App built with vanilla JavaScript and Local Storage.

Current Features
 
- User can _create_ a new note 
- User can _update_ and _save_ an existing note (both title and body) 
- User can _delete_ an existing note 
- User can _save_ a note 

*Notes data will be saved in your browser local storage

## Get Started

*Prerequisite*

- Install Node.js (suggest v18+)
- Install [pnpm](https://pnpm.io/installation) globally 

If you are Github user, just folk this repository and start to work on it.

If you are not a Github user, clone and download this repo and push to your flavor git host .

1. Install all the packages by `pnpm install`
3. Start the development by `pnpm run dev`
4. Work on the tasks described below

> :warning: 请使用当前项目环境完成以下题目并提交个人仓库链接

**Tasks**

1. Fix the existing bugs happen to this note application
2. Refactor this app to a React app with TypeScript
3. Make sure the current feature is working fine after refactoring
4. Provide some improvements on the UI&UX
5. Follow the folder structure below:

```
- src:
    - sidebar (This directory contains the `Sidebar.tsx` file, which handles the sidebar functionality.)
        - Sidebar.tsx
    - editPanel (This directory contains the `EditPanel.tsx` file, responsible for the edit panel functionality.)
        - EditPanel.tsx
    ...All other files
```
6. Do NOT include a `Save` button in the program. The program should automatically save all editing data and reflect these changes on the sidebar.

Please ensure to maintain this structure for consistency across the project.
i.e
- in terms of layout: navbar, editor panel, preview panel
- in terms of UX: adding confirmation/warning modal when user save/delete a note


**Bonus Tasks**
 
- Create a new button called `Import Notes`, which allow user to import notes in batch
- Create a new button called `Export Notes`, which allow user to export all the notes from the local storage
- Import & export files can be in csv or xml format
- Minimize Unnecessary Re-renders.  
e.g.
Consider a scenario where two notes are displayed on the sidebar. If you edit and save the first note, only the first note should be re-rendered. The second note should remain unaffected and not re-render.

## How to Submit Your Test
Commit and push your latest your changes to public repository, and share your URL to us.

Thank you and look forward to see your work!

## CheckList
Basic Tasks
- [x] Fix the existing bugs happen to this note application
- [x] Refactor this app to a React app with TypeScript
- [x] Make sure the current feature is working fine after refactoring
- [x] Provide some improvements on the UI&UX
- [x] adding confirmation/warning modal when user save/delete a note
- [x] Do NOT include a Save button in the program. The program should automatically save all editing data and reflect these changes on the sidebar.

Bonus Tasks
- [x] Create a new button called Import Notes, which allow user to import notes in batch
- [x] Create a new button called Export Notes, which allow user to export all the notes from the local storage
- [x] Import & export files can be in csv or xml format
- [ ] Minimize Unnecessary Re-renders.
e.g. Consider a scenario where two notes are displayed on the sidebar. If you edit and save the first note, only the first note should be re-rendered. The second note should remain unaffected and not re-render.
