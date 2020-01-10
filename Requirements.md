# Business Requirements

This document outlines the user and business requirements for the Spice project.

**Table of Contents**
- [Tasks](#Tasks)
- [Goals](#Goals)
    - [Adding a Goal](#Adding-a-Goal)
- [Rewards](#Rewards)
- [Penalties](#Penalties)

## Tasks

As you would expect with any ToDo app, Tasks are ubiquitous within Spice. Whenever something needs to be done, a Task contains the details about _what_ needs to be done. Thus, it typically includes the following data:

- Title of the task
- Instructions on how to complete the task
- Date the task should start
- Date the task should have been completed

### User Stories - Adding a Task

- [ ] User should be able to fill out and submit a form with data about a task.
    - [ ] User should be able to associate the created task with a goal
        - [ ] By adding thet task from the goal
        - [ ] By dragging and dropping a task onto a goal
    - [ ] User should be able to click "Save"
    - [ ] After "Save" is clicked, the Task should be available
        - [ ] In the list of all Tasks.
        - [ ] In the list of tasks for the associated Goal, if there is one.
    - [ ] User shoudl be able to scroll through the form's fields when they overrun the page.


## Goals

Goals are a fundamental part of Spice, because a Goal comes with Rewards. There are several goal types, but each typically comes with several typical data items:

- Title of the goal
- Date of start
- Date of expiration (you got to commit to completing the goal at some point, you know?)
- Data on how often the goal recurs
- What kind of Reward should be generated when the Goal is completed
- Tier of the goal, since some goals are more important or difficult than others, and deserve to marked as such


### User Stories - Adding a Goal

- [ ] User should be able fill out and submit a form with data about goals
    - [ ] User should be able to fill out data about recurrence of the goal.
    - [X] User should be able to fill out data about whether the goal is a streak.
    - [X] User should be able to click "Save"
    - [X] After "Save" is clicked, the new Goal should available in the GoalList.
    - [X] After "Save" is clicked, all fields of the Goal should be saved to the database as a new goal.
    - [ ] User should be able to scroll through the form's fields when they overrun the page.

- [ ] User should be able to edit an existing Goal through a form
    - [ ] User should be able to edit data about recurrence of the goal.
    - [ ] User should be able to edit data about whether the goal is a streak.
    - [X] User should be able to click "Save"
    - [X] Saving should actually update the Goal in the database.
    - [X] After "Save" is clicked, the edited Goal, with all changes, should available after navigating back to the GoalList.
    - [ ] User should be able to scroll through the form's fields when they overrun the page

- [ ] User should be able to delete a Goal while in the Goal's form
    - [ ] User should be prompted for confirmation about the deletion

### User Stories - Viewing Goals

- [X] Users should be able to view all existing goals
    - [X] User should be able to see basic information on the goal
        - [X] Title
        - [X] Due Date
        - [X] Type (for example, some goals are streaks)
        - [ ] Start Date (so they can know what's coming).
    - [ ] User should be able to scroll through goals when they overrun the page.
- [ ] Users should be able to sort on
    - [ ] Title
    - [ ] Due Date
    - [ ] Type
- [ ] Users should be able to filter on
    - [ ] Title
    - [ ] Due Date
    - [ ] Type
- [ ] Users should be able to delete one or more goals from the full list
    - [ ] Deleting goals should delete associated subtasks and subgoals
    - [ ] User should be able to toggle a Delete Mode
    - [ ] User should be able to mark multiple goals for deletion
    - [ ] User should be prompted to confirm deletes

### User Stories - Viewing Tasks on Goals

- [ ] Users should be able to view an existing goal with 
    - [ ] A summary of the goal and its tasks at the top
    - [ ] A list of the tasks below with
        - [ ] Title
        - [ ] Start Date
        - [ ] Due Date
- [ ] Users should be able to re-order tasks within a goal by drag-and-drop.
- [ ] Users should be able to click on a task to view it, and its sub-tasks, in more detail.

## Rewards

Rewards are part of what makes Spice different from the usual task planner application. When a user completes one of their goals, typically they will earn a reward. Rewards can come in different flavors, but core rewards include the following:

- A specific reward
- A randomly chosen reward from some non-strict subset of all rewards
    - by group, if the user has organized some of the rewards into groups
    - by Tier, if the user has assigned Tiers to his goals
- A selection of rewards -- the user can choose just 1
    - by group
    - by Tier
    - by a random selection from groups, tiers, or the entire pool of rewards

Rewards typically come with the following data items:

- Title of the reward
- Date of expiration (you got to take advantage of the reward at some point -- don't be a workaholic!)
- Data on how often the reward recurs. Is the reward available just once, once per month? Or every Friday the 13th? Having a variety of recurring rewards will make your experience Spicier.
- Tier of the reward, since some rewards are more fitting for certain goal tiers.
- Points - points will typically be automatically calculated (formula to be determined), but they provide you with a way to view your efforts over time.

## Penalties

Penalties are part of what makes Spice different from the usual task planner application. They are intended to be constructive, not punitive. Here are several example penalties:

- Cleaning your apartment
- Starting to exercise regularly 
- Confronting one of your fears
- Asking for some change at work

Penalties should be things that are ultimately good for you, but unpleasant enough that you put them off. They range from minor things like spring cleaning and exercising to large things like confronting your fears. They should also be things that you can afford to put off -- don't avoid filing your taxes on time because you didn't get Penalized while using Spice! (Make filing your taxes early a Goal instead)

Penalties may be incurred for several reasons:

- When a user fails to complete one of their goals by the established deadline (deadlines are encouraged for that reason)
- When a user completes one of their goals, a penalty may be occasionally assigned. This is part of life's Spice - good is not always rewarded, and sometimes doing unpleasant things is ultimately rewarding.

Penalties typically come with the following data items:

- Title of the penalty
- Due date (you earned the penalty -- now own it!)
- Data on how often the penalty occurs. Although it's easiest to think of one-time penalties, having recurring penalties will keep your chances to push through the hard stuff, up.
- Tier of the penalty, since some penalties are harder than others.
- Points - points will typically be automatically calculated (formula to be determined). Completing penalties will also boost your scores over time.
- Whether this penalty has been converted to a goal, since some penalties are just goals that we have been putting off because they seem to disruptive to our current lifestyle.