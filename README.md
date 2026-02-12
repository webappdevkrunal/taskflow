# TaskFlow

TaskFlow is a Trello-inspired project management board built with a scalable Effector architecture.

It focuses on state transitions, entity modeling, and derived filtering logic.

---

## Concept

This demo simulates a SaaS-style task management tool where users can manage projects and move tasks across different stages.

---

##  Features

- Create project
- Add tasks
- Move tasks:
  - Pending
  - In Progress
  - Done
- Priority filtering
- Task counters per column
- Persistent state

---

## Architectural Focus

TaskFlow emphasizes:

- Multiple store coordination
- Derived filtered views
- Event-driven state transitions
- Feature-based folder structure

---

##  State Modeling

- Projects store
- Tasks store
- Active filters
- Derived task groups
- Event chaining

