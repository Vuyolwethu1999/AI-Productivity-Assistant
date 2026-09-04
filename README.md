# WigWise AI

BUILD PROMPT — ZanD Human-Blend Wig Business Platform

Act as a senior product designer, UX designer, full-stack developer, and AI product engineer.

Build a complete, polished, responsive web application for a human-blend wig business.

The application must combine:

E-commerce + Customer Management + Business Operations + AI Productivity Tools

The goal is to solve a real business problem: small wig businesses often manage customer communication, product information, orders, marketing, meetings, and daily tasks manually or across disconnected tools. This application should centralize those workflows and use AI to reduce repetitive administrative work while keeping the business owner in control.

1. PRIMARY USERS

Design for two user types:

Business Owner/Admin

Needs to:

Manage human-blend wig products

Monitor inventory

Manage customers

Track orders

Manage business tasks

Communicate with customers

Plan marketing campaigns

Summarize meetings and consultations

Monitor business performance

Customer

Needs to:

Browse human-blend wigs

Search and filter products

View detailed product information

Add products to a cart

Place orders

View order status

Contact the business

2. CORE APPLICATION STRUCTURE

Create a modern SaaS-style admin dashboard with a left sidebar.

Sidebar

Dashboard

Products

Orders

Customers

Inventory

Marketing

AI Tools

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

Analytics

Settings

The sidebar should be collapsible on desktop and replaced by a mobile navigation menu on smaller screens.

3. DASHBOARD

Create a professional dashboard showing an immediate overview of the business.

KPI Cards

Display:

Total Revenue

Orders

Customers

Products

Low Stock Items

Pending Orders

Each card should show:

Current value

Comparison with previous period

Positive/negative trend indicator

Charts

Include:

Revenue over time

Orders over time

Best-selling wig products

Inventory status

Customer growth

Use clean, readable charts with tooltips.

4. HUMAN-BLEND WIG E-COMMERCE

Create a product management system specifically for human-blend wigs.

Every product should support:

Product name

SKU

Price

Sale price

Product images

Hair composition

Length

Texture

Color

Density

Cap construction

Available quantities

Description

Care instructions

Shipping information

Return information

Product status

Clearly communicate that the products are human-blend wigs.

Do not describe human-blend products as 100% human hair.

Product categories

Include:

Bob

Straight

Curly

Body Wave

Deep Wave

Lace Wig

Glueless Wig

Colored Wig

Long Wig

Short Wig

New Arrivals

Best Sellers

Include:

Search

Filter

Sort

Add Product

Edit Product

Delete Product

Stock management

5. CUSTOMER EXPERIENCE

Create a polished storefront where customers can:

Browse wigs

Search products

Filter by price

Filter by length

Filter by texture

Filter by color

View product details

Add products to wishlist

Add products to cart

Checkout

View order confirmation

Track orders

The product page should clearly display all relevant product information.

6. SMART EMAIL GENERATOR

Build a domain-specific AI email assistant.

User Interface

Create a structured form instead of a generic AI chatbot.

Fields:

Email Purpose

Options:

New Product Announcement

Wig Promotion

Restock Announcement

Order Confirmation

Shipping Update

Customer Follow-Up

Abandoned Cart

Customer Service

Thank You

Re-engagement

Custom

Audience

New Customer

Existing Customer

VIP Customer

Potential Customer

Tone

Professional

Friendly

Luxury

Warm

Promotional

Casual

Context

Allow the user to enter relevant information such as:

Product name

Price

Discount

Promotion

Customer information

Important dates

Call to action

Length

Short

Medium

Long

AI Prompt Architecture

Internally construct the AI request using:

SYSTEM CONTEXT

You are an AI business communication assistant for a professional human-blend wig business.

TASK

Generate a professional customer-facing email based on the provided purpose, audience, tone, context and desired length.

CONSTRAINTS

Do not invent product specifications.

Do not invent prices or discounts.

Do not make unsupported claims.

Clearly distinguish human-blend wigs from 100% human hair.

Maintain a professional and trustworthy tone.

Use only information supplied by the user.

Include a suitable call to action when appropriate.

OUTPUT

Return:

Subject line

Preview text

Email body

Call to action

Output

Display the result in an editable rich-text editor.

Actions:

Edit

Regenerate

Copy

Save

Clear

Never automatically send an AI-generated email without human approval.

7. MEETING NOTES SUMMARIZER

Create an AI tool designed specifically for:

Customer wig consultations

Supplier meetings

Marketing meetings

Team meetings

Product planning

Structured Inputs

Meeting title

Date

Participants

Meeting type

Raw notes

Additional context

Desired summary style

AI Prompt Architecture

SYSTEM CONTEXT

You are a meeting-notes assistant for a human-blend wig business.

TASK

Transform raw meeting notes into a clear, structured summary.

CONSTRAINTS

Do not invent information.

Do not infer decisions that were not stated.

Clearly distinguish facts from suggestions.

Preserve important customer preferences.

Flag unclear or missing information.

OUTPUT

Generate:

Executive Summary

Key Discussion Points

Customer/Product Insights

Decisions

Action Items

Follow-Up Items

Unresolved Questions

Every generated section must be editable.

Actions:

Edit

Regenerate

Copy

Save

Export

Delete

8. AI TASK PLANNER

Create an AI-powered task planning system for the business.

Example user goal:

"Launch our new human-blend bob wig collection in four weeks."

Structured Inputs

Goal

Deadline

Priority

Available team members

Available resources

Budget

Additional context

AI Prompt Architecture

SYSTEM CONTEXT

You are an AI project planning assistant for a human-blend wig business.

TASK

Convert the user's business goal into a realistic, prioritized action plan.

CONSTRAINTS

Do not create impossible deadlines.

Break large goals into practical tasks.

Identify dependencies.

Prioritize urgent tasks.

Clearly identify assumptions.

Do not claim tasks have been completed.

Ask for clarification when essential information is missing.

OUTPUT

For every task provide:

Task name

Description

Priority

Assigned person

Estimated duration

Deadline

Dependencies

Status

9. TASK MANAGEMENT

Allow users to:

Edit tasks

Add tasks

Delete tasks

Reorder tasks

Assign tasks

Change deadlines

Change priority

Mark tasks complete

Provide both:

List View

A structured task table.

Kanban View

Columns:

To Do

In Progress

Completed

Allow users to switch between views.

10. RESPONSIBLE AI

Responsible AI must be visible throughout the AI Tools section.

Display:

Responsible AI: AI-generated content may contain errors, omissions, or inaccurate information. Review and verify all AI outputs before sending, publishing, or making business decisions based on them.

Implement the following safeguards:

Human approval before external communication

Editable AI outputs

No automatic sending of AI-generated emails

No fabricated product specifications

No fabricated prices or discounts

No unsupported claims about wig quality

Clearly label AI-generated content

Allow users to regenerate outputs

Allow users to discard AI outputs

Protect customer information

Avoid exposing sensitive customer information unnecessarily

11. AI STATES & ERROR HANDLING

Every AI feature must include:

Empty State

Explain what the tool does and how to use it.

Loading State

Show a professional AI generation indicator.

Success State

Display the generated result.

Error State

Provide a clear error message and retry button.

Validation

Prevent generation when required fields are missing.

Regeneration

Allow the user to regenerate the result without losing the previous version.

12. RESPONSIVE DESIGN

The application must be fully responsive.

Desktop

Sidebar

Dashboard grid

Charts

Tables

Product grids

Tablet

Adaptive navigation

Responsive cards

Two-column layouts where appropriate

Mobile

Hamburger navigation

Single-column layouts

Stacked dashboard cards

Touch-friendly controls

Mobile-friendly product browsing

Responsive AI forms

Full-width editable outputs

No horizontal scrolling.

13. PREMIUM UI DESIGN

Use a design language inspired by modern SaaS products but adapted to a premium beauty/wig brand.

Colors

Primary:

Deep charcoal

Warm cream

Soft beige

Accent:

Champagne/gold

Muted rose or nude

Use colors consistently for:

Primary actions

Secondary actions

Status badges

Alerts

AI features

Visual Style

Clean

Minimal

Elegant

Premium

Spacious

Professional

Accessible

Use subtle animations but avoid excessive motion.

14. INNOVATION

Make the application feel more innovative than a standard wig store.

The AI tools should work together as a connected business workflow.

Example workflow:

Customer Consultation → Meeting Notes Summarizer → Action Items → AI Task Planner → Smart Email Generator → Customer Follow-Up

Another workflow:

New Wig Added → AI Task Planner → Marketing Tasks → Smart Email Generator → Promotional Campaign

Show these connections visually where appropriate.

Add an AI Activity/History area where the business owner can see:

Recently generated emails

Recent summaries

Recent task plans

Allow saved AI outputs to be revisited and edited.

15. PRESENTATION QUALITY

The finished application should look like a real commercial product rather than a basic prototype.

Ensure:

Consistent spacing

Professional typography

High-quality imagery

Clear hierarchy

Consistent buttons

Consistent card design

Meaningful icons

Clear error states

Useful empty states

Realistic sample data

Polished responsive layouts

Accessible contrast

Keyboard-friendly interactions

Avoid:

Generic placeholder interfaces

Excessive gradients

Cluttered dashboards

Random colors

Unnecessary animations

Generic AI chatbot styling

SUCCESS CRITERIA

The final application should clearly demonstrate the following:

Problem Relevance

Solves genuine administrative and operational problems for a human-blend wig business.

Prompt Engineering

Uses structured AI prompts with defined context, task, constraints, inputs and outputs.

Functionality

Provides realistic product, customer, order, inventory, dashboard and AI workflows.

Innovation

Connects the AI tools into useful business workflows rather than presenting them as isolated features.

Responsible AI

Keeps humans in control, prevents unsupported claims, labels AI content, and requires review before important actions.

Presentation

Looks like a polished, premium SaaS product designed specifically for a modern human-blend wig business.

Build the application as a cohesive product experience, not simply a collection of separate pages.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://wig-whisperer-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9dc3f70e-78f9-469c-ad04-79fb9b1548db).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
