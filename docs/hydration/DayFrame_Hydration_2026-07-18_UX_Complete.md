# DayFrame Hydration Packet --- UX Design Complete / Engine Audit Ready

*Date:* 2026-07-18

## Project Status

The UX/Product Design phase is considered complete. The next phase is a
structured audit of the existing scheduling engine before implementation
changes begin.

The design process intentionally followed an **outside-in** approach:

1.  Design the desired user experience.
2.  Define the workflow.
3.  Establish product philosophy.
4.  Audit the existing engine.
5.  Perform a gap analysis.
6.  Implement changes.

------------------------------------------------------------------------

# Product Philosophy

DayFrame is **not**:

-   A traditional calendar
-   A task manager
-   An AI assistant

DayFrame **is**:

> A deterministic planning system that learns the recurring rhythm of
> the user's life and helps them intentionally invest the time that
> remains.

Users teach DayFrame.

DayFrame records reality, explains patterns, and offers deterministic,
explainable recommendations.

------------------------------------------------------------------------

# Four Pillars

## Teach

Routine Builder

Contains:

-   Routines
-   Commitments
-   Goals

Purpose:

Teach DayFrame the rhythm of the user's life.

------------------------------------------------------------------------

## Plan

Monthly Planner

Displays:

-   Generated Commitments
-   Goal Allocations
-   Friction

Supports:

-   Add Commitment
-   Add Goal
-   Apply Routine

------------------------------------------------------------------------

## Live

Daily Workspace

Execution surface.

Owns:

-   Goal sessions
-   Commitment completion
-   Found Time
-   Notes
-   Friction resolution

Capture occurs here.

Reflection does not.

------------------------------------------------------------------------

## Learn

Summary

Reflection surface.

Supports:

-   Day
-   Week
-   Month
-   Quarter
-   Year-to-Date

Contains:

-   Goal investment
-   Commitment outcomes
-   Found Time
-   Notes
-   Reflection
-   Deterministic recommendations

Summary explains what happened rather than presenting raw statistics.

------------------------------------------------------------------------

# Routine Builder

Purpose:

Teach DayFrame recurring life structure.

Routine contains:

## Commitments

Internal engine classifications:

-   Foundational (Sleep, Meals)
-   Scheduled (Work, School, Appointments)
-   Personal (Laundry, Grocery, Maintenance)

These classifications remain internal.

Users interact with natural categories only.

Applying a Routine requests a date range.

Only Commitments within that range are regenerated.

History is immutable.

------------------------------------------------------------------------

# Goals

Creation is intentionally minimal.

Required fields:

-   Name
-   Importance

Goals cannot be created until at least one Commitment exists.

Advanced behavior belongs in Goal Management:

-   Allocation Strategy
-   Completion Strategy
-   Preferred Allocation Window
-   Edit / Rename / Delete

Goal creation shares the "+" entry point with Commitment creation.

------------------------------------------------------------------------

# Onboarding

Two learning styles are supported.

## Show Me

Guided walkthrough covering:

1.  Create first Commitment
2.  Create first Goal
3.  Monthly Planner
4.  Daily Workspace
5.  Summary
6.  Feedback Loop

## Let Me

Immediate access to the application.

------------------------------------------------------------------------

# Help System

Every major screen and dialog contains an information ("i") button.

Each help dialog answers:

-   What is this?
-   Why would I use it?
-   How does it fit into DayFrame?
-   Tips

A full DayFrame Handbook is accessible from each major screen.

------------------------------------------------------------------------

# Design Principles

-   Teach DayFrame the rhythm of your life.
-   Commitments own time.
-   Goals borrow remaining capacity.
-   Capture first. Reflect later.
-   History is immutable.
-   Users interact with tools, not agents.
-   Recommendations must always be explainable.
-   Creation requires minimal information.
-   Advanced behavior belongs in management surfaces.
-   The application adapts to the user rather than asking the user to
    adapt to it.

------------------------------------------------------------------------

# Engine Review Strategy

The next conversation begins the Engine Audit.

Approach:

1.  Repository-wide architecture audit.
2.  Narrow subsystem audits.
3.  Compare current engine to approved UX.
4.  Produce a gap analysis.
5.  Build an implementation roadmap.

The first Codex audit prompt has already been prepared.

The audit must document current behavior before recommending changes.
