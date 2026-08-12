# I. Purpose

The **DayFrame Interaction Architecture Specification** defines the enduring architectural principles governing how people interact with the DayFrame system.

Where the **DayFrame Complete Architecture Specification** describes the internal organization of the software—including its Domain Objects, Architectural Services, Architectural Engines, information lifecycle, and system responsibilities—this specification describes the architecture of the human experience.

Its purpose is to define how users teach the system, collaborate in the planning process, record execution, reflect upon outcomes, and progressively improve future planning through consistent interaction with DayFrame.

This specification intentionally operates at the architectural level rather than the implementation level.

It does not prescribe visual layouts, interface components, color palettes, typography, animation, or platform-specific user interface design. Those concerns are implementation decisions that may evolve over time without changing the fundamental interaction model.

Instead, this document defines the enduring structure of the relationship between the user and the system.

## Relationship to the System Architecture

The DayFrame architecture describes how the software is organized.

The Interaction Architecture describes how a person experiences that organization.

These two specifications are complementary.

The System Architecture defines the internal responsibilities of the Teach, Plan, Live, and Learn Engines.

The Interaction Architecture defines how users naturally participate in those same activities.

Together, the two specifications describe the complete DayFrame system:

* one from the perspective of software organization,
* one from the perspective of human interaction.

Neither replaces the other.

Both are required to fully describe DayFrame.

## Scope

This specification defines the architectural principles governing human interaction with DayFrame, including:

* the user's mental model of the system,
* interaction philosophy,
* interaction architecture,
* application surfaces,
* information visibility,
* navigation principles,
* interaction patterns,
* progressive disclosure,
* accessibility principles,
* long-term interaction consistency.

These concepts are intended to remain stable even as the visual interface evolves across platforms, technologies, and future product generations.

Accordingly, this specification deliberately avoids implementation-specific user interface decisions wherever possible.

## Objectives

The Interaction Architecture has four primary objectives.

First, it establishes a consistent interaction model that remains independent of any particular user interface implementation.

Second, it ensures that every interaction faithfully reflects the responsibilities and lifecycle defined by the System Architecture.

Third, it provides an objective architectural standard against which future interface implementations can be evaluated.

Finally, it promotes long-term consistency by separating enduring interaction principles from transient visual design decisions.

## Architectural Philosophy

The Interaction Architecture is founded upon a simple principle:

> **Users should interact with DayFrame through meaningful planning activities rather than software configuration.**

The objective is to enable the internal mechanics of the planning system.

The objective is to enable users to naturally express intent, understand proposed plans, record lived experience, and learn from accumulated history without requiring knowledge of the architectural mechanisms that make those capabilities possible.

The interaction model therefore emphasizes conversations over configuration, planning over programming, and understanding over complexity.

## Intended Audience

This specification is intended for everyone responsible for shaping the human experience of DayFrame, including:

* product designers,
* software engineers,
* architects,
* user experience designers,
* quality assurance engineers,
* documentation authors,
* future contributors.

It serves as the authoritative reference for evaluating whether new interactions preserve the intended experience of the DayFrame system.

## Guiding Principle

The purpose of the Interaction Architecture is not to describe how the interface looks.

Its purpose is to describe how interacting with DayFrame should feel.

Every screen, workflow, interaction, and future user interface should ultimately reinforce the same enduring experience:

The user teaches DayFrame about the rhythm of their life.

DayFrame produces deterministic plans from that understanding.

The user lives those plans.

Together, the user and DayFrame continuously improve future planning through observation, reflection, and learning.

# II. UX Philosophy

The DayFrame Interaction Architecture is founded upon the belief that effective planning emerges not from increasingly complex software, but from a clear understanding of how people naturally organize their lives.

Accordingly, DayFrame is designed to reduce cognitive overhead rather than expose unnecessary configuration. Its objective is not to expose every planning decision to manual configuration, but to enable users to express intent clearly while allowing deterministic planning systems to perform the computational work.

Every interaction should reinforce this philosophy.

Users should spend their time thinking about their lives—not thinking about the software.

## Planning Rather Than Configuration

DayFrame is a planning system.

It is not a configuration system.

The interface should encourage users to think in terms of routines, commitments, goals, priorities, and outcomes rather than settings, options, rules, or scheduling algorithms.

Whenever possible, users should make meaningful planning decisions while the system performs the necessary computational decisions.

Configuration exists to support planning—not to become the primary activity.

## Teach Before Plan

Effective planning begins with understanding.

The first responsibility of the interaction model is therefore to help users teach DayFrame about the recurring rhythm of their lives.

Users define what matters.

DayFrame determines how that understanding can best be organized into a realistic plan.

The quality of planning is directly proportional to the quality of understanding established during the Teach phase.

## Deterministic Collaboration

DayFrame is neither autonomous nor conversational in the sense of a general-purpose assistant.

Planning is a collaborative activity between a human decision-maker and a deterministic planning system.

The user establishes intent.

DayFrame performs deterministic computation.

Recommendations should always be derived from observable information, remain reproducible, and be explainable to the user.

Trust is established through consistency rather than personality.

## Commitments Own Time

Time is first allocated to commitments.

Goals do not compete with commitments.

Instead, goals are allocated from the capacity that remains after commitments have been satisfied.

This distinction should remain visible throughout the interaction model.

Users should naturally understand that commitments represent obligations while goals represent opportunities.

## Capture First. Reflect Later.

Recording lived experience should require as little interruption as possible.

Interactions occurring during daily execution should prioritize speed, clarity, and minimal cognitive effort.

Reflection belongs within the Learn phase rather than the Live phase.

By separating execution from reflection, DayFrame encourages users to remain focused on living their day while preserving sufficient information for meaningful reflection later.

## History Is Immutable

Historical information represents what actually occurred.

It should never be silently rewritten to preserve consistency with changing plans or preferences.

Future plans may change.

Historical records should not.

This distinction establishes trust in the integrity of the planning system and enables meaningful long-term analysis.

## Progress Through Progressive Disclosure

DayFrame should remain approachable for new users while supporting increasing sophistication over time.

Users should encounter complexity only when it becomes valuable.

Early interactions should emphasize understanding routines, commitments, and goals.

Advanced planning concepts should emerge naturally as users develop familiarity with the system.

The application should adapt to the user's experience rather than requiring the user to adapt to the application.

## Explain Before Optimize

Every recommendation should be understandable before it becomes more capable.

Users should always be able to determine:

* what information influenced a recommendation,
* why a recommendation was produced,
* what assumptions were made,
* what changes would alter the result.

Transparency takes precedence over algorithmic sophistication.

An understandable recommendation that users trust is more valuable than a more complex recommendation whose reasoning cannot be explained.

## Conversations Over Screens

Users should experience DayFrame as a sequence of meaningful planning activities rather than a collection of disconnected application screens.

Each interaction should contribute to one of four continuous conversations:

* teaching the system,
* reviewing a plan,
* recording lived experience,
* learning from history.

The organization of the interface should reinforce these conversations rather than emphasizing navigation between pages.

## The System Adapts to the User

The objective of DayFrame is not to encourage users to conform to an idealized planning methodology.

Instead, DayFrame should progressively learn and reflect the recurring rhythm of each user's life.

As understanding improves, planning should require less effort while becoming more accurate.

The application should become increasingly personalized while remaining completely predictable.

## Enduring Principle

Every interaction within DayFrame should support a single overarching objective:

> **Help people think about their lives—not about the software managing them.**

If an interaction causes users to spend more time configuring the planning system than planning their lives, that interaction should be reconsidered.

The best interactions are those in which the software disappears and the planning process remains visible.

# III. Design Principles

The Design Principles translate the DayFrame UX Philosophy into enduring guidance for designing interactions.

Where the UX Philosophy describes the beliefs underlying the interaction model, these principles describe how those beliefs should consistently appear throughout the product.

Every interaction, workflow, and future interface should reinforce these principles.

## 1. Intent Before Detail

Interactions should begin with the user's intent rather than implementation details.

Users should first express what they are trying to accomplish.

The system should determine how that intent is represented internally.

Whenever possible, software concepts should remain behind the interaction rather than becoming part of it.

---

## 2. Progress Through Understanding

Understanding should precede optimization.

Users should never be expected to configure advanced behavior before understanding the planning model.

The interaction should reveal additional capabilities only after foundational concepts have become familiar.

Complexity should emerge gradually rather than appearing all at once.

---

## 3. One Conversation at a Time

Every interaction should advance a single primary conversation.

Users should always know which planning activity they are performing.

An interaction should not simultaneously attempt to teach, plan, execute, and analyze.

The four architectural conversations—Teach, Plan, Live, and Learn—should remain distinct while flowing naturally into one another.

---

## 4. Explain Every Recommendation

Recommendations should never appear without context.

Whenever DayFrame proposes a plan, adjustment, or recommendation, users should be able to understand:

* what information influenced the recommendation,
* why it was produced,
* what assumptions were made,
* how different inputs would produce different results.

Understanding should always accompany automation.

---

## 5. Preserve Cognitive Continuity

Interactions should maintain the user's mental focus.

Users should spend their attention thinking about routines, commitments, goals, and decisions—not navigating software.

Whenever possible, workflows should preserve context rather than forcing users to repeatedly reorient themselves.

The system should adapt around the user's thought process rather than interrupting it.

---

## 6. Stable Mental Models

Equivalent concepts should always behave consistently.

The same action should produce the same kind of result regardless of where it appears.

Terminology should remain consistent throughout the application.

Users should be able to predict how new interactions behave based on previous experience.

Consistency reduces learning effort and increases trust.

---

## 7. Reveal Complexity Only When Valuable

Advanced capabilities should become available only when they meaningfully improve planning.

Features should not exist simply because they are technically possible.

Every additional interaction should provide proportionally greater value than the complexity it introduces.

If a capability cannot justify its cognitive cost, it should remain hidden or be removed.

---

## 8. Preserve User Agency

DayFrame assists planning.

It does not replace judgment.

Users should remain the final authority over commitments, priorities, goals, and decisions.

Recommendations should inform decisions rather than dictate them.

The interaction should reinforce collaboration rather than automation for its own sake.

---

## 9. Respect Time

Every interaction consumes attention.

Every additional decision consumes mental energy.

The interface should respect both.

Frequently performed interactions should become increasingly efficient.

Rarely used functionality should not interfere with everyday planning.

The system should reward familiarity without penalizing new users.

---

## 10. Design for Evolution

The interaction architecture should accommodate future capabilities without requiring users to relearn the system.

New features should feel like natural extensions of existing conversations rather than entirely new workflows.

Growth should increase capability without increasing conceptual fragmentation.

The application should become more capable while remaining familiar.

---

## 11. Favor Consistency Over Novelty

Consistency is more valuable than cleverness.

Interactions should prioritize predictability over surprise.

Visual presentation may evolve.

Technology may evolve.

Implementation may evolve.

The interaction model should remain immediately recognizable.

Long-term familiarity builds confidence and reduces cognitive effort.

---

## Enduring Principle

Every interaction should satisfy three questions:

1. Does it help the user accomplish a meaningful planning activity?
2. Does it preserve the user's understanding of the system?
3. Does it make future interactions easier rather than more complicated?

If an interaction cannot satisfy all three, it should be reconsidered before becoming part of the product.

# IV. User Mental Model

The Interaction Architecture defines not only how users interact with DayFrame, but also how they understand it.

Every interaction contributes to the user's mental model.

A consistent mental model allows users to predict system behavior, understand recommendations, and develop confidence in the planning process.

Accordingly, the interaction architecture should continuously reinforce the same understanding of what DayFrame is, what it does, and what role the user plays within it.

## What DayFrame Is

DayFrame is a personal planning system.

Its purpose is to transform a user's understanding of their life into realistic, deterministic plans that can be lived, observed, and continuously improved over time.

The system is organized around an ongoing planning cycle:

* Teach the system about your life.
* Review and refine proposed plans.
* Live those plans.
* Learn from what actually happened.

This cycle is continuous.

Each phase improves the quality of the next.

## What DayFrame Is Not

DayFrame is not a calendar.

Calendars primarily record events.

DayFrame plans how available time should be used before events occur.

---

DayFrame is not a task manager.

Task managers organize work.

DayFrame organizes life.

Tasks may exist within that process, but they are not the primary purpose of the system.

---

DayFrame is not a habit tracker.

Habits represent one category of recurring behavior.

DayFrame considers routines, commitments, goals, capacity, and lived experience together as part of a broader planning process.

---

DayFrame is not an autonomous assistant.

The system does not replace judgment.

It performs deterministic planning based upon information supplied by the user.

Recommendations arise from consistent planning principles rather than conversational reasoning.

## The User's Role

The user is the expert on their own life.

Only the user can determine:

* priorities,
* commitments,
* goals,
* preferences,
* personal values.

These decisions establish intent.

The user teaches the system what matters.

## The System's Role

DayFrame is responsible for transforming user intent into realistic plans.

DayFrame performs the computational work required to:

* organize commitments,
* allocate available capacity,
* identify conflicts,
* generate recommendations,
* preserve historical information,
* support future reflection.

The system manages complexity so that the user does not have to.

## A Collaborative Relationship

Planning is a partnership.

The user provides meaning.

The system provides organization.

Neither replaces the other.

Users should never feel that they are programming the application.

Likewise, they should never feel that the application is making important life decisions on their behalf.

Instead, the interaction should consistently reinforce the idea that planning emerges through collaboration between human judgment and deterministic computation.

## Plans Are Proposals

A generated plan is not a command.

It is a proposal based upon the current understanding of the user's life.

Plans may be accepted.

They may be adjusted.

They may be replaced.

Every plan represents the DayFrame's best recommendation given the available information.

The objective is not perfection.

The objective is continuous improvement.

## History Represents Reality

Plans describe what is expected.

History records what actually occurred.

These concepts should remain distinct.

Users should understand that historical information exists to improve future planning rather than to preserve the appearance of consistency.

Learning requires an accurate record of reality.

## Continuous Learning

The planning cycle never truly ends.

Every completed day becomes additional information.

Every observation improves understanding.

Every improvement strengthens future planning.

Rather than repeatedly creating independent schedules, users gradually build an increasingly accurate representation of how they actually live.

DayFrame becomes more effective not because it becomes more intelligent, but because it becomes more informed.

## Enduring Mental Model

Throughout every interaction, users should naturally understand a simple truth:

> **I teach DayFrame how my life works. DayFrame helps me organize it. Together we continuously improve future planning.**

Every interaction within the product should reinforce this understanding.

If an interaction causes users to think they are configuring software, manually scheduling every hour, or surrendering control to automation, the interaction has drifted away from the intended mental model.

# V. Interaction Architecture

The Interaction Architecture defines how users engage with DayFrame through a continuous series of planning conversations.

These conversations represent the human counterpart to the system lifecycle defined by the System Architecture.

Rather than organizing the application around disconnected screens or features, DayFrame organizes interaction around the natural progression of planning itself.

Each conversation corresponds to a distinct planning activity.

Together, these conversations form a continuous cycle through which understanding becomes planning, planning becomes lived experience, lived experience becomes history, and history improves future understanding.

## Conversations as the Primary Unit

The fundamental unit of interaction is the conversation.

A conversation represents a coherent planning activity with a clear objective.

Individual screens, dialogs, workflows, and interface components exist solely to support that conversation.

Consequently, visual interfaces may evolve over time while the underlying conversations remain stable.

This separation allows the Interaction Architecture to remain independent of specific interface implementations.

## The Four Planning Conversations

The Interaction Architecture consists of four primary conversations.

### Teach

The Teach conversation establishes understanding.

Users communicate the recurring structure of their lives by defining routines, commitments, goals, preferences, priorities, and other enduring aspects of daily life.

The objective is not to build schedules.

The objective is to build understanding.

The result of the Teach conversation is an increasingly accurate representation of how the user's life is organized.

---

### Plan

The Plan conversation transforms understanding into actionable plans.

Using the information established during Teach, DayFrame generates deterministic planning proposals, identifies conflicts, allocates available capacity, and presents recommendations for review.

Planning is collaborative.

The system proposes.

The user evaluates.

Together they refine the resulting plan.

The objective is not perfect prediction.

The objective is to produce the best possible plan from the current understanding of the user's life.

---

### Live

The Live conversation represents execution.

Users live their day rather than continuously redesigning it.

Interactions emphasize recording meaningful changes, capturing important events, and maintaining awareness without interrupting daily life.

Execution should remain lightweight.

The planning process should support living rather than becoming the focus of it.

---

### Learn

The Learn conversation transforms historical information into future improvement.

Users review completed plans, compare expectations with reality, observe recurring patterns, and identify opportunities for refinement.

Learning is reflective rather than corrective.

The purpose is not to judge previous decisions.

The purpose is to improve future planning.

## Conversation Transitions

* The four conversations are not isolated workflows.

* Each conversation naturally produces the information required by the next.

* Teach provides understanding.

* Understanding enables planning.

* Planning guides execution.

* Execution creates history.

* History improves understanding.

* The interaction architecture should make these transitions feel continuous rather than fragmented.

* Users should experience one ongoing planning process rather than four separate application modules.

## Conversation Ownership

Each conversation has a clearly defined responsibility.

Teach owns understanding.

Plan owns proposal generation.

Live owns execution.

Learn owns reflection.

Interactions should preserve these boundaries.

Conversation responsibilities should not become blurred through convenience or interface simplification.

Maintaining clear ownership reduces cognitive complexity and reinforces the user's mental model.

## Conversation Independence

Although conversations cooperate, each remains independently understandable.

At any point, users should understand:

* which conversation they are participating in,
* what its objective is,
* what information is being created,
* how that information contributes to future planning.

Clarity of purpose is essential for maintaining confidence in the planning process.

## Architectural Continuity

The planning cycle repeats continuously throughout the lifetime of the user's relationship with DayFrame.

Users may revisit previous conversations whenever new understanding becomes available.

Learning may inspire changes to routines.

Updated routines produce improved plans.

Improved plans create new experiences.

The cycle repeats continuously throughout the lifetime of the system.

## Enduring Principle

The Interaction Architecture is organized around conversations because conversations represent meaningful planning activities.

Screens, pages, dialogs, and interface components exist only to support those conversations.

Every interaction should therefore answer a single question:

> **Which planning conversation does this belong to?**

If that question cannot be answered immediately and unambiguously, the interaction should be reconsidered before becoming part of the product.

# VI. Surface Architecture

The Surface Architecture defines where users participate in the planning conversations established by the Interaction Architecture.

Where Conversations describe *what** users are doing, Surfaces describe **where** those activities occur.

A Surface is the persistent interaction environment in which a planning Conversation occurs.

Individual screens, panels, dialogs, and workflows exist within a Surface, but they do not define it.

Surfaces remain stable even as their visual implementation evolves.

## Surface Ownership

Every primary Surface is owned by exactly one planning conversation.

Likewise, every planning conversation is primarily realized through one Surface.

This one-to-one relationship preserves conceptual clarity throughout the Interaction Architecture.

Users should always understand both:

* which Surface they are currently using,
* which planning conversation that Surface supports.

The ownership model intentionally mirrors the relationship established within the System Architecture, where each Architectural Engine owns a distinct responsibility.

Interaction ownership and architectural ownership should therefore remain aligned.

## The Teach Surface

The Teach Surface is the home of understanding.

Its purpose is to help users communicate the recurring structure of their lives.

Within this Surface, users define and refine:

* routines,
* commitments,
* goals,
* planning preferences,
* recurring information,
* other enduring planning knowledge.

The Teach Surface answers a single question:

> **"How does my life work?"**

## The Plan Surface

The Plan Surface transforms understanding into proposed schedules.

Here, users review generated plans, evaluate recommendations, resolve conflicts, and refine planning decisions before execution.

The Plan Surface answers:

> **"Given what the system knows, what should my plan look like?"**

## The Live Surface

The Live Surface supports execution.

Its purpose is not to continually redesign plans, but to help users navigate the day with minimal interruption.

Interactions emphasize awareness, lightweight adjustments, and recording meaningful events as reality unfolds.

The Live Surface answers:

> **"What is happening right now?"**

## The Learn Surface

The Learn Surface supports reflection.

Users review historical information, identify recurring patterns, evaluate planning effectiveness, and improve future understanding.

The Learn Surface answers:

> **"What can I learn from what actually happened?"**

## Workspaces

Each Surface may contain one or more Workspaces.

A Workspace represents a focused interaction within its parent Surface.

Examples include:

* Routine Builder
* Commitment Editor
* Monthly Planner
* Daily Planner
* Weekly Review
* Goal Review
* Capacity Analysis

Workspaces support specialized activities while remaining part of their parent planning conversation.

They should never become independent planning systems.

## Surface Independence

Surfaces should remain conceptually independent.

Although information naturally flows between Conversations, users should not feel that multiple planning activities are competing for attention simultaneously.

Each Surface should maintain a clear objective.

Whenever possible, interactions belonging to different onversations should remain within their respective Surfaces.

## Persistent Identity

The identity of a Surface should remain stable over time.

Visual layouts may change.

Navigation models may change.

Technology platforms may change.

The purpose of the Surface should not.

Users should develop long-term familiarity with the role each Surface plays within the planning process.

## Cross-Surface Continuity

Although Surfaces remain distinct, they should feel like parts of a single planning system.

Transitions between Surfaces should preserve context whenever possible.

Information should appear where it is most meaningful rather than being duplicated unnecessarily.

The objective is not to isolate planning activities.

The objective is to organize them.

## Architectural Alignment

The Surface Architecture mirrors the overall DayFrame architecture.

| Architectural Layer | Responsibility   |
| ------------------- | ---------------- |
| Engine              | Owns computation |
| Conversation        | Owns interaction |
| Surface             | Owns place       |
| Workspace        | Owns focus  |

These layers work together.

The Engine performs the work.

The Conversation defines the activity.

The Surface provides the environment in which that activity occurs.

## Enduring Principle

Every primary Surface should exist for one reason:

> **To provide a stable home for one planning conversation.**

If a proposed Surface attempts to support multiple unrelated conversations, it should be reconsidered.

Likewise, if a conversation requires multiple unrelated Surfaces to be understood, the interaction architecture has likely become unnecessarily fragmented.

# VII. Information Architecture

The Information Architecture defines how information is presented throughout the planning lifecycle.

Its purpose is not to expose the complete internal state of the planning system.

Its purpose is to expose only the information necessary for users to understand, evaluate, and improve their planning.

Accordingly, the Information Architecture describes what information is visible, when it becomes visible, and why it becomes visible.

## Information Supports Understanding

Information should always exist to improve understanding.

Users should never be presented with information solely because it exists internally within the system.

Every visible piece of information should contribute to understanding.

* understand their lives,
* understand a recommendation,
* make a planning decision,
* reflect upon previous outcomes.

Information that does not support one of these purposes should generally remain internal.

## Domain Objects Are Not User Interfaces

The System Architecture defines numerous Domain Objects that support planning.

Not every Domain Object should appear directly within the interaction model.

Many exist solely to support deterministic computation.

Users should interact with planning concepts rather than computational structures.

The interaction architecture therefore presents information that represents planning concepts rather than implementation concepts.

## Visible Planning Concepts

Information presented to users should be organized around concepts that naturally exist within the planning process.

Examples include:

* routines,
* commitments,
* goals,
* plans,
* capacity,
* recommendations,
* historical outcomes,
* reflections,
* recurring patterns.

These concepts reinforce the user's mental model because they describe planning rather than computation.

## Hidden Computational Concepts

Many architectural concepts remain intentionally invisible.

Examples include:

* planning candidates,
* allocation records,
* scheduling constraints,
* optimization state,
* intermediate calculations,
* internal provenance structures,
* engine coordination.

These concepts are essential to the architecture but unnecessary for everyday planning.

Keeping them internal reduces cognitive complexity while preserving architectural flexibility.

## Progressive Disclosure

Information should appear when it becomes valuable.

New users should primarily encounter concepts necessary for basic planning.

As users gain experience, additional information may become available to support more sophisticated planning decisions.

Complexity should emerge naturally rather than being presented immediately.

Progressive disclosure applies equally to information and functionality.

## Context Determines Visibility

Information should appear within the planning conversation to which it contributes.

* Teach emphasizes understanding.

* Plan emphasizes proposals and recommendations.

* Live emphasizes awareness.

* Learn emphasizes reflection and historical insight.

The same information may appear differently depending upon the conversation it supports.

Presentation should always reinforce the objective of the current conversation.

## Explain Relationships, Not Mechanisms

Whenever possible, information should explain relationships rather than implementation.

Users benefit from understanding that:

* a commitment reduces available capacity,
* a recommendation follows from changing priorities,
* recurring interruptions affect planning quality.

Users seldom benefit from understanding the computational mechanisms producing those relationships.

The system should therefore communicate meaning rather than process.

## Provenance Without Complexity

Users should be able to understand where important information originated.

Recommendations should explain the observations or planning knowledge that influenced them.

Historical records should preserve their origin.

Meaningful planning decisions should remain understandable and traceable.

However, provenance should be communicated through understandable explanations rather than exposing internal implementation details.

Transparency should increase confidence without increasing complexity.

## Information Hierarchy

Information should naturally organize itself according to planning significance.

Generally, users should encounter information in the following order:

1. Current situation
2. Immediate commitments
3. Available capacity
4. Goals and opportunities
5. Recommendations
6. Historical insight
7. Supporting detail

The interaction should consistently prioritize what is most relevant to the user's current planning activity.

## Minimize Cognitive Load

Every additional piece of visible information requires attention.

Information should therefore compete for visibility based upon usefulness rather than availability.

Displaying more information is not inherently better.

Displaying the right information at the right time improves understanding while preserving cognitive focus.

## Enduring Principle

The Information Architecture exists to make planning understandable.

Users should see exactly enough information to confidently make planning decisions.

The planning system may internally possess significantly more information than it exposes.

This is intentional.

The objective is not to reveal how tDayFrame works internally.

The objective is to help users understand their lives.

# VIII. Navigation Architecture

The Navigation Architecture defines how users move throughout the DayFrame interaction model.

Navigation is not responsible for organizing the interaction model.

That responsibility belongs to the Interaction Architecture.

Instead, navigation provides consistent, predictable access to planning conversations while preserving the user's understanding of where they are, what they are doing, and why.

Navigation should support planning without becoming the focus of the planning experience.

## Navigation Supports Planning

Navigation exists to support planning conversations.

Users should spend their attention organizing their lives rather than organizing the application.

Consequently, navigation should remain simple, predictable, and largely invisible.

The best navigation requires almost no conscious thought.

## Navigation Areas

The DayFrame application is organized around two primary Navigation Areas.

### Planner

The Planner is the forward-looking planning environment.

It provides access to the conversations responsible for understanding, planning, and daily execution.

Conceptually, the Planner answers:

> **"What should I do?"**

The Planner contains the following Surfaces:

* Teach
* Plan
* Live

These Surfaces are presented as one continuous planning experience rather than independent applications.

---

### Summary

The Summary is the reflective environment.

It provides access to historical information, planning effectiveness, recommendations, trends, and long-term learning.

Conceptually, the Summary answers:

> **"What have I learned?"**

The Summary primarily presents the Learn Surface while maintaining appropriate connections to the planning information from which those insights are derived.

## Surface Navigation

Navigation Areas contain Surfaces.

Surfaces contain Workspaces.

Users navigate first to a Navigation area, then participate in the appropriate planning conversation.

Surfaces should never appear as unrelated destinations.

Their relationship to the planning lifecycle should remain obvious.

## Workspace Navigation

Workspaces provide focused planning activities within a Surface.

Examples include:

* Routine Builder
* Monthly Planner
* Daily Workspace
* Weekly Review
* Goal Review
* Capacity Review
* Commitment Editor

Workspaces are not primary navigation destinations.

They are entered through their parent Surface and exited back into the surrounding planning conversation.

The user should always feel that they are continuing the same planning activity rather than moving between disconnected applications.

## Universal Navigation Language

The DayFrame interaction model establishes a consistent navigation language throughout the application.

### Primary Action

A single tap performs the primary action associated with an object.

Examples include opening a Commitment, beginning execution, selecting a day, or activating a recommendation.

Users should confidently assume that a single tap performs the most common action.

### Context

A long press reveals contextual actions.

Contextual actions provide additional capabilities without interrupting the current planning conversation.

Whenever possible, contextual actions should preserve the user's location within the application.

### Details

A double tap opens detailed information.

Detail views expand understanding without replacing the surrounding planning context.

Users should return naturally to the location from which they requested additional information.

## Universal Creation

Creation should begin through a shared entry point.

The primary creation interface provides access to authored planning objects such as:

* Commitments
* Goals

Whenever appropriate, creation should begin with the user's intent rather than object configuration.

Shared creation reinforces consistency while reducing navigation complexity.

## Context Preservation

Navigation should preserve context whenever possible.

Changing locations should not require users to reconstruct their understanding of the planning process.

Relevant selections, planning periods, and surrounding information should remain available across navigation transitions when doing so improves continuity.

## Navigation Reflects Time

The Navigation Architecture mirrors the temporal nature of planning.

Planner emphasizes the present and the future.

Summary emphasizes reflection and future improvement through historical understanding.

Organizing navigation around time is more intuitive than organizing it around technical features or implementation concepts.

## Architectural Boundaries

Navigation should reinforce the ownership established by the Interaction Architecture.

Routine management belongs within Teach.

Planning belongs within Plan.

Execution belongs within Live.

Reflection belongs within Learn.

Historical information should not be modified from planning activities.

Reflection should not interrupt execution.

Each planning conversation remains responsible for its own information and interactions.

## Navigation Does Not Expose Architecture

Users navigate planning activities.

They do not navigate software architecture.

Navigation should never expose concepts such as:

* Engines
* Services
* Domain Objects
* Scheduling algorithms
* Internal computational state

The planning system may be architecturally sophisticated. 

Its navigation should remain conceptually simple.

## Platform Independence

The Navigation Architecture is independent of visual implementation.

Desktop, mobile, web, tablet, wearable, and future interfaces may present navigation differently while preserving the same interaction model.

Navigation controls may evolve.

Navigation Areas, planning conversations, and Surface ownership should remain stable.

## Enduring Principle

Navigation should quietly support planning.

Users should think about:

* what they want to accomplish,
* what they should do next,
* what they have learned,
* how their lives are improving.

They should rarely think about the navigation itself.

If navigation becomes more noticeable than the planning conversations it supports, it has become unnecessarily complex.

# IX. Interaction Patterns

The Interaction Patterns define the consistent behaviors through which users participate in the DayFrame planning system.

Their purpose is to establish a predictable interaction language that remains consistent across every Surface, Workspace, and platform.

Users should not need to relearn interactions as they move throughout the application.

Consistency improves understanding, reduces cognitive effort, and strengthens trust in the planning experience.

## Interactions Reinforce the Mental Model

Every interaction should reinforce the planning model established throughout this specification.

Interactions should consistently reinforce that users are:

* teaching the system,
* creating plans,
* executing commitments,
* or reflecting upon reality.

Interactions that obscure these distinctions weaken the user's understanding of the planning process.

## Direct Manipulation

Users should interact directly with meaningful planning concepts.

They should manipulate:

* Commitments,
* Goals,
* Routines,
* Recommendations,
* Notes,
* Reflections.

Users should rarely interact with abstract settings or intermediary configuration screens when a direct interaction is possible.

## Progressive Interaction

Simple interactions should remain simple.

Advanced capabilities should become available naturally as they become valuable to the user.

The most common planning activities should require the fewest interactions.

Less common capabilities should remain discoverable without overwhelming the primary workflow.

## Capture Before Configuration

Whenever possible, users should capture information immediately.

Detailed configuration should occur afterward.

The interaction should favor preserving ideas over requesting complete information before creation.

This principle reduces interruption while encouraging consistent planning behavior.

## Rich Management

Creating planning objects should remain intentionally lightweight.

Managing those objects may appropriately provide considerably richer capabilities.

Creation and management serve different purposes and should therefore optimize for different experiences.

## Explain Before Acting

Recommendations should explain why they exist before asking users to accept them.

Suggested changes should clearly communicate:

* the observed situation,
* the reasoning,
* the expected outcome.

Understanding should always precede automation.

## Immediate Feedback

Every meaningful interaction should produce visible feedback.

Users should understand that an action has been received, completed, or requires additional attention.

Feedback should remain proportional to the significance of the interaction.

Minor actions require subtle confirmation.

Major planning decisions deserve more explicit acknowledgment.

## Preserve Flow

Interactions should avoid unnecessarily interrupting planning.

Dialogs, confirmations, and secondary workflows should interrupt planning only when they protect important user information or prevent significant mistakes.

Whenever possible, interactions should maintain the user's current planning context.

## Editing Is Continuous

Planning is an iterative activity.

Users should feel comfortable revisiting previous decisions.

Editing should be straightforward, reversible where appropriate, and consistent throughout the application.

The interaction model should encourage refinement rather than perfection.

## Notes Capture Context

Notes exist to capture information during execution.

They should be fast to create.

They should automatically inherit contextual information such as time, associated Commitment, and planning session.

Users should focus on recording observations rather than organizing metadata.

Reflection occurs later.

## Recommendations Support Decisions

Recommendations are advisory.

They assist users in making planning decisions without replacing user judgment.

Recommendations should always remain deterministic, explainable, and optional.

Users retain authority over every planning decision.

## Consistency Across Surfaces

Equivalent interactions should behave consistently regardless of the Surface in which they occur.

Selecting, editing, completing, deleting, or reviewing similar planning objects should follow the same interaction patterns throughout the application.

Consistency should take precedence over localized optimization.

## Platform Adaptation

Interaction patterns should adapt to platform capabilities without changing their underlying meaning.

Touch, mouse, keyboard, voice, and future interaction modalities may perform interactions differently while preserving the same conceptual behavior.

The interaction language should remain stable even as implementation evolves.

## Enduring Principle

Interactions should feel natural because they are consistent.

Users should learn the interaction language only once.

That language should remain dependable regardless of where they are within DayFrame.

Every interaction should strengthen the user's confidence in both the planning process and the planning system.

# X. Visual Philosophy

The Visual Philosophy defines the enduring principles that guide the visual expression of the Interaction Architecture.

Its purpose is not to prescribe a particular aesthetic style.

Instead, it establishes the visual values that every interface should communicate regardless of platform, theme, or future visual redesign.

Visual implementation may evolve.

Visual philosophy should endure.

## Clarity Above Decoration

The primary purpose of visual design is to improve understanding.

Every visual decision should help users recognize information, understand relationships, identify priorities, and make planning decisions.

Decorative elements should never compete with meaning.

Visual beauty should emerge from clarity rather than ornamentation.

## Visual Hierarchy Reflects Planning Hierarchy

Visual emphasis should correspond to planning significance.

Information that requires immediate attention should receive the greatest visual emphasis.

Supporting information should remain available without competing for attention.

The interface should naturally guide attention toward the most meaningful planning decisions.

## Calm Interfaces Encourage Clear Thinking

Planning is a reflective activity.

The interface should promote focus rather than stimulation.

Visual noise, excessive animation, unnecessary decoration, and competing points of emphasis increase cognitive effort without improving planning.

The application should feel calm, intentional, and trustworthy.

## Consistency Builds Recognition

Equivalent concepts should appear consistently throughout the application.

Commitments should always resemble Commitments.

Goals should always resemble Goals.

Recommendations should always resemble Recommendations.

Users should recognize planning concepts through repeated visual language rather than repeatedly reading labels.

Consistency strengthens familiarity while reducing cognitive effort.

## Visuals Communicate Meaning

Color, typography, spacing, motion, and iconography should communicate meaning rather than provide decoration.

Visual differences should represent meaningful differences in planning information.

Whenever possible, visual distinction should indicate differences in purpose, priority, status, or relationship.

Purely decorative variation should be minimized.

## Information Before Chrome

The interface should emphasize planning information rather than application controls.

Users should perceive their plans before they perceive the software.

Navigation, controls, and interface chrome should support planning without dominating the visual experience.

The application itself should quietly recede into the background.

## Motion Serves Understanding

Motion should communicate change.

Motion should reinforce continuity, spatial relationships, and state transitions.

Motion should never exist solely for entertainment.

Subtle, purposeful transitions improve orientation while preserving the user's mental model.

## Progressive Visual Complexity

The interface should reveal visual complexity gradually.

New users should encounter simple, approachable layouts.

Additional visual detail may emerge as planning activities become more sophisticated.

Complexity should reflect user growth rather than application ambition.

## Platform Respect

Visual implementation should respect the conventions of each platform.

Desktop, mobile, web, and future interfaces may differ in appearance while preserving the same visual philosophy.

The planning experience should feel native to the platform while remaining recognizably DayFrame.

## Accessibility Is Beauty

Interfaces are visually successful only when they remain understandable to every user.

Readability, contrast, scalable typography, meaningful color usage, and alternative methods of communicating information should be considered fundamental elements of visual quality rather than accessibility accommodations.

Inclusive design improves clarity for everyone.

## Timelessness Over Trends

Visual trends change.

Planning principles do not.

The visual identity of DayFrame should favor timeless clarity over fashionable aesthetics.

Future redesigns should be able to modernize the appearance without requiring changes to the Interaction Architecture.

## Enduring Principle

The visual design of DayFrame should quietly disappear behind the planning experience.

Users should remember their plans.

They should remember their progress.

They should remember the confidence they gained from understanding their lives.

They should rarely remember the interface itself.

The highest achievement of the visual design is not that it attracts attention.

It is that it makes understanding effortless.

# XI. Accessibility

Accessibility defines the enduring principles that ensure every person can meaningfully participate in the DayFrame planning experience.

Accessibility is not an optional enhancement or a separate feature.

It is a fundamental characteristic of a well-designed planning system.

The objective is to make planning understandable, achievable, and dependable regardless of a user's abilities, circumstances, experience, or technology.

## Accessibility Through Architecture

Accessibility begins with architecture rather than implementation.

Consistent interactions, stable mental models, predictable navigation, meaningful information hierarchy, and explainable recommendations reduce cognitive effort for every user.

An accessible application is the natural result of an interaction model designed for understanding.

## Design for Human Diversity

Users approach planning with different abilities, experiences, technologies, environments, and life circumstances.

The interaction Architecture should respect this diversity without requiring different conceptual models for different groups of users.

Every person should participate in the same planning experience through interfaces that adapt to their needs.

## Multiple Ways to Interact

Every meaningful planning activity should remain achievable through multiple input methods whenever practical.

Examples include:

* touch,
* mouse,
* keyboard,
* assistive technologies,
* voice,
* future interaction methods.

No essential planning activity should depend exclusively upon a single method of interaction.

## Meaning Beyond Color

Color should reinforce understanding rather than create understanding.

Status, priority, recommendations, and planning outcomes should never depend solely upon color.

Icons, labels, typography, spatial relationships, and other visual cues should communicate the same information.

Users should never be excluded because of differences in color perception.

## Readability Above Density

Planning requires comprehension.

Typography, spacing, contrast, and layout should prioritize readability over maximizing information density.

Interfaces should remain comfortable during prolonged planning sessions.

Understanding is always more valuable than displaying additional information.

## Cognitive Accessibility

Planning frequently occurs when users are mentally fatigued.

The interaction model should therefore reduce unnecessary memory, attention, and decision-making requirements.

Users should rarely need to remember hidden rules, complicated procedures, or previous navigation paths.

The application should consistently guide understanding rather than test memory.

## Progressive Complexity

Users should encounter only the complexity appropriate to their current planning activity.

Advanced capabilities should become available as users grow more familiar with the system.

Reducing initial complexity improves accessibility for everyone while preserving long-term capability.

## Explainable Decisions

Recommendations, planning suggestions, and significant system behavior should remain understandable.

Users should know:

* what happened,
* why it happened,
* what options are available.

Explainability improves accessibility by reducing uncertainty and increasing confidence.

## Error Recovery

Mistakes are an expected part of planning.

Users should receive clear explanations of problems along with straightforward methods of correcting them.

Whenever possible, interactions should be reversible or safely editable.

The application should encourage experimentation without fear of irreversible consequences.

## Platform Accessibility

Every supported platform should respect the accessibility capabilities provided by the operating system.

Screen readers, scalable typography, keyboard navigation, system contrast settings, reduced motion preferences, and platform accessibility services should integrate naturally with the DayFrame interaction model.

Accessibility should feel native rather than retrofitted.

## Accessibility Evolves

Accessibility is an ongoing architectural responsibility.

As new technologies, interaction methods, and user needs emerge, the planning experience should evolve while preserving the core principles established throughout this specification.

Future improvements should strengthen inclusion without requiring users to relearn the planning model.

## Enduring Principle

Every person deserves the opportunity to understand and improve their life through effective planning.

DayFrame should never make planning more difficult because of a user's abilities, environment, technology, or circumstances.

Accessibility is not measured by the number of accommodations provided.

It is measured by how consistently every user can participate in the same planning experience with confidence, dignity, and independence.

# XII. Future Expansion

The purpose of this specification is not to define every future capability of DayFrame.

Its purpose is to establish an architectural foundation upon which future capabilities can be built without compromising the principles defined throughout this document.

Future expansion should strengthen the planning experience while preserving the consistency, clarity, and mental model established by the Interaction Architecture.

Growth should occur through extension rather than reinvention.

## Architecture Before Features

New capabilities should emerge from the existing architectural model whenever possible.

Before introducing a new feature, its relationship to:

* the planning lifecycle,
* the planning conversations,
* the Navigation Areas,
* the Surfaces,
* the Workspaces,
* and the Information Architecture

should be clearly understood.

Features should fit the architecture.

The architecture should not be rewritten to accommodate individual features.

## Preserve the Mental Model

Future capabilities should reinforce the user's existing understanding of DayFrame.

Users should not need to develop a new mental model in order to benefit from additional functionality.

Planning should remain recognizable regardless of how much the application evolves.

Architectural continuity reduces learning while increasing confidence.

## Extend Conversations

The four planning conversations—

* Teach
* Plan
* Live
* Learn

are intended to remain stable.

Future functionality should deepen these conversations whenever practical rather than introducing entirely new ones.

When expansion is necessary, preference should be given to extending existing conversations before creating additional interaction models.

## Preserve Navigation Simplicity

Future growth should not increase primary navigation complexity.

Planner and Summary remain the enduring organizational structure of the application.

Additional capabilities should integrate naturally within the existing Navigation Areas rather than competing with them.

The number of features may grow substantially while the navigation remains simple.

## Expand Through Workspaces

Most future functionality should appear as new or enhanced Workspaces.

This approach allows DayFrame to increase capability while preserving both the Navigation Architecture and the Surface Architecture.

Users gain additional tools without requiring additional conceptual overhead.

## Respect Information Architecture

Additional information should improve understanding rather than increase visibility.

New data should become visible only when it supports planning decisions or reflection.

The accumulation of information should never become an accumulation of cognitive burden.

## Platform Evolution

Future platforms may introduce new interaction methods, display technologies, and capabilities.

The Interaction Architecture should adapt to these environments while preserving:

* planning conversations,
* Surface ownership,
* Navigation Areas,
* interaction consistency,
* and visual clarity.

Technology should influence implementation rather than architectural identity.

## Intelligent Assistance

Future advances in artificial intelligence, automation, or planning technologies should strengthen—not replace—the collaborative relationship between the user and the planning system.

Users continue to define meaning, priorities, commitments, and goals.

The system continues to provide deterministic organization, explainable recommendations, and planning assistance.

New technologies should increase capability without reducing transparency, user agency, or trust.

## Continuous Refinement

The Interaction Architecture is expected to evolve.

As new research, user feedback, implementation experience, and planning insights emerge, this specification should be refined through deliberate architectural revision.

Architectural evolution should remain intentional, documented, and internally consistent.

## Compatibility With Future Systems

The principles defined within this specification are intended to remain applicable across future implementations of DayFrame.

Whether planning occurs through traditional graphical interfaces, conversational interfaces, ambient computing, wearable devices, or technologies not yet available, the planning philosophy should remain recognizable.

The implementation may change.

The planning experience should endure.

## Enduring Principle

The success of DayFrame will not be measured by the number of features it acquires.

It will be measured by its ability to grow without becoming more complicated.

Every future capability should make the planning system more capable while preserving the clarity, consistency, and confidence that define the DayFrame experience.

Architecture succeeds when growth feels natural rather than disruptive.

# Appendix A — Architectural Principles

The Architectural Principles define the enduring philosophy that governs the DayFrame Interaction Architecture.

Unlike implementation decisions, these principles are expected to remain stable as the application evolves across future releases, platforms, and technologies.

Every architectural decision should reinforce these principles.

When new capabilities are introduced, these principles serve as the standard by which their consistency with the DayFrame planning philosophy should be evaluated.

---

# Planning Philosophy

## Planning Rather Than Configuration

DayFrame exists to help users organize their lives rather than configure software.

Users should spend their time making meaningful planning decisions instead of managing application settings.

---

## Teach Before Plan

The planning system must first understand the user's life before meaningful planning can occur.

Understanding precedes recommendation.

---

## Commitments Own Time

Committed obligations consume available time.

Goals invest only the remaining capacity.

This distinction preserves realistic planning.

---

## Capture First, Reflect Later

Information should be captured when it occurs.

Interpretation and reflection belong to a later planning conversation.

---

## History Is Immutable

Historical events represent reality.

Reality may be understood differently over time, but it should never be rewritten.

---

# Interaction Philosophy

## Conversations Organize Interaction

Planning is organized around enduring conversations rather than independent screens.

Teach.

Plan.

Live.

Learn.

These conversations define the user's relationship with the planning system.

---

## Consistency Builds Trust

Equivalent concepts should behave consistently throughout the application.

Predictability reduces cognitive effort while increasing user confidence.

---

## Progressive Disclosure

Complexity should appear only when it provides value.

Users should encounter sophistication gradually rather than immediately.

---

## Explain Before Optimize

Recommendations should always explain their reasoning before requesting user action.

Understanding precedes automation.

---

## Preserve User Agency

The planning system assists decision making.

It never replaces the user's authority over their own life.

---

# Architectural Philosophy

Communicate Meaning Rather Than Process

Every interaction, recommendation, visual distinction, and piece of information should communicate meaning rather than implementation.

Users should understand planning relationships, consequences, and decisions without needing to understand the internal computational processes that produce them.

The architecture should expose what helps people plan while allowing implementation details to remain appropriately internal.

## Clarity Above Decoration

Every visual and interaction decision should improve understanding.

Aesthetics should reinforce clarity rather than compete with it.

---

## Information Supports Understanding

Users should see information because it helps them make planning decisions, not because the system possesses it.

---

## Accessibility Through Architecture

Accessibility is achieved through consistency, clarity, predictability, and thoughtful interaction design rather than isolated accommodations.

Inclusive architecture benefits every user.

---

## Navigation Serves Planning

Navigation exists to support planning conversations.

It should never become the user's primary activity.

---

## Architecture Before Features

New capabilities should strengthen the existing architecture.

The architecture should not be reshaped to accommodate individual features.

---

# Growth Philosophy

## Extend Rather Than Replace

Future capabilities should deepen existing planning conversations whenever possible.

Architectural continuity preserves understanding while enabling growth.

---

## Grow Without Complexity

Capability should increase without requiring proportional increases in cognitive effort.

Growth should feel natural rather than disruptive.

---

## Platform Independence

The planning philosophy should remain recognizable across every platform and future interaction technology.

Implementation may change.

The planning experience should endure.

---

## Continuous Refinement

The Interaction Architecture is expected to evolve through deliberate architectural improvement informed by implementation experience, user feedback, and continued research.

Evolution should be intentional, documented, and internally consistent.

---

# Enduring Principle

The purpose of the Interaction Architecture is not merely to define how DayFrame behaves.

Its purpose is to preserve a planning philosophy that remains understandable, trustworthy, and consistent as the application grows.

Every architectural decision should strengthen that philosophy.

Every future implementation should faithfully inherit it.

# Appendix B — Glossary

This glossary defines the architectural terminology used throughout the DayFrame Interaction Architecture Specification.

These definitions establish a shared vocabulary for designers, engineers, contributors, testers, and future maintainers.

Unless explicitly stated otherwise, architectural terms should be interpreted according to these definitions rather than their general usage.

---

## Accessibility

The architectural quality that enables every user to meaningfully participate in the planning experience regardless of ability, circumstance, technology, or environment.

---

## Capacity

The remaining available time after Commitments have been allocated.

Capacity represents the time available for Goal investment and discretionary planning.

---

## Commitment

A scheduled obligation that consumes time.

Commitments represent activities the user intends to perform or has performed.

Examples include work, appointments, meals, maintenance, errands, and personal responsibilities.

Commitments own time.

---

## Conversation

One of the four enduring planning activities that organize user interaction with DayFrame:

* Teach
* Plan
* Live
* Learn

Conversations define the purpose of interaction rather than the visual implementation.

---

## DayFrame

The planning system as a whole.

DayFrame is a deterministic planning assistant that users teach over time through their routines, commitments, goals, and execution history.

---

## Found Time

Previously unallocated capacity that becomes available through schedule changes, early completion, cancellation, or other planning events.

Found Time may be invested into Goals or other meaningful activities.

---

## Friction

Any condition that prevents a plan from being completed as intended.

Friction may result from scheduling conflicts, insufficient capacity, interrupted execution, or other planning challenges.

Friction represents opportunities for improvement rather than failure.

---

## Goal

A desired long-term outcome toward which discretionary capacity is invested.

Goals do not own time.

They receive available capacity after Commitments have been satisfied.

---

# Information Architecture

The architectural model that defines what information becomes visible, when it becomes visible, and why it becomes visible in support of planning understanding.

---

# Interaction Architecture

The architectural model governing the planning conversations, Surfaces, navigation, information, interaction patterns, and visual philosophy through which users collaborate with DayFrame.

---

## Learn

The planning conversation responsible for reflection, analysis, recommendations, and continuous improvement.

---

## Live

The planning conversation responsible for execution, note capture, commitment completion, and real-time planning.

---

# Mental Model

The conceptual understanding users develop regarding how planning works, how DayFrame behaves, and how their actions influence the planning process.

---

## Navigation Area

The highest level of application organization.

DayFrame contains two Navigation Areas:

* Planner
* Summary

Navigation Areas organize movement throughout the planning experience.

---

## Planner

The primary Navigation Area for forward-looking planning.

Planner contains the Teach, Plan, and Live Surfaces.

---

# Planning Lifecycle

The continuous progression through the Teach, Plan, Live, and Learn Conversations that organizes planning over time.

---

## Plan

The planning conversation responsible for constructing, reviewing, and adjusting future plans.

---

## Recommendation

An explainable planning suggestion produced by the planning engine.

Recommendations remain deterministic, transparent, and optional.

Users retain final authority over every planning decision.

---

## Reflection

The deliberate process of interpreting historical execution in order to improve future planning.

Reflection occurs within the Learn conversation.

---

## Routine

A reusable collection of recurring Commitments.

Applying a Routine produces Commitments for a specified planning period without modifying historical execution.

---

## Summary

The primary Navigation Area dedicated to reflection, historical understanding, recommendations, and long-term planning improvement.

Summary primarily presents the Learn Surface.

---

## Surface

The persistent interaction environment associated with a planning Conversation.

Surfaces provide the architectural home for related Workspaces.

---

## Teach

The planning conversation responsible for helping DayFrame understand the user's life through routines, commitments, goals, preferences, and recurring planning behavior.

---

## User Agency

The architectural principle that users remain responsible for all meaningful planning decisions.

The planning system assists decision-making but never replaces user authority.

---

## User Day

The user-defined planning day bounded by a configurable day boundary rather than the calendar midnight.

User Days provide the temporal foundation for planning, scheduling, and historical analysis.

---

## Workspace

A focused planning environment within a Surface.

Examples include the Routine Builder, Monthly Planner, Daily Workspace, Goal Review, and Capacity Review.

Workspaces support specific planning activities while remaining part of the larger planning conversation.

---

# Glossary Maintenance

New architectural terminology introduced through future revisions of the Interaction Architecture should be added to this glossary.

Existing definitions should evolve only through deliberate architectural revision.

Maintaining a consistent architectural vocabulary is essential to preserving a consistent planning philosophy.

# Appendix C — Revision History

The Revision History documents the architectural evolution of the DayFrame Interaction Architecture Specification.

Its purpose is to document significant changes to the planning philosophy, interaction model, architectural principles, and organizational structure of the specification.

Implementation changes, interface refinements, and software releases are not recorded unless they introduce corresponding architectural revisions.

Maintaining this history preserves the rationale behind architectural decisions while providing future contributors with a clear understanding of how the planning philosophy has evolved over time.

---

## Version 1.0

**Status:** Initial Publication

**Date:** July 2026

### Major Architectural Milestones

Established the first complete architectural specification describing the human interaction model of DayFrame.

Defined the four enduring planning Conversations:

* Teach
* Plan
* Live
* Learn

Established Surface Architecture as the persistent organizational structure for planning conversations.

Defined the two primary Navigation Areas:

* Planner
* Summary

Separated Navigation Areas, Surfaces, Workspaces, and Conversations into distinct architectural responsibilities.

Established the Information Architecture governing visibility, information hierarchy, and progressive disclosure.

Defined a universal Navigation Architecture emphasizing consistency, context preservation, and minimal cognitive effort.

Established Interaction Patterns as the consistent behavioral language governing all user interactions.

Defined the Visual Philosophy centered upon clarity, consistency, calm interfaces, and meaningful visual communication.

Established Accessibility as an architectural responsibility emerging from clarity, consistency, and thoughtful interaction design.

Defined the principles governing future architectural expansion while preserving the enduring planning model.

Published the initial Architectural Principles appendix establishing the long-term planning philosophy.

Published the initial Glossary establishing the architectural vocabulary of the Interaction Architecture.

---

## Future Revisions

Subsequent revisions should record only architectural changes that affect one or more of the following:

* Planning Philosophy
* Interaction Model
* Planning Conversations
* Navigation Architecture
* Surface Architecture
* Information Architecture
* Interaction Patterns
* Visual Philosophy
* Accessibility Principles
* Architectural Principles
* Architectural Terminology

Routine editorial corrections, formatting improvements, implementation notes, and software releases should not be recorded unless they materially alter the architectural intent of the specification.

---

## Revision Process

Architectural revisions should:

* preserve internal consistency,
* document their rationale,
* maintain compatibility with existing architectural principles whenever possible,
* identify affected sections of the specification,
* and update the Revision History as part of the architectural review process.

Architectural evolution should be deliberate rather than incremental.

The purpose of this document is to preserve continuity while allowing thoughtful growth.

---

## Enduring Principle

Architecture is expected to evolve.

Its evolution should remain intentional, documented, and internally consistent.

Every revision should strengthen the planning philosophy while faithfully preserving the clarity, predictability, and trust that define the DayFrame Interaction Architecture.
