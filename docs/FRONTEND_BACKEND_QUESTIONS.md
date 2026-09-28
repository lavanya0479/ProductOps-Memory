# Frontend ↔ Backend Questions

The frontend is currently being developed before the backend API implementation is available.

## 1. Chat API

Endpoint expected:

POST /api/chat

Questions:
- What is the exact request body?
- What is the exact response body?
- Does the response include the recalled memory?
- Does it include supporting evidence?
- Does it include product/version information?
- Does it include confidence or relevance information?

## 2. Teach Memory API

Endpoint expected:

POST /api/memory/teach

Questions:
- What fields are required?
- What is the exact request schema?
- What is the exact response schema?
- Does the response return the created memory ID?
- Does it return source/type information?

## 3. Recall Memory API

Endpoint expected:

POST /api/memory/recall

Questions:
- What is the exact request body?
- What is the exact response body?
- How are multiple memories returned?
- Does each memory include product/version/source information?

## 4. Correct Memory API

Endpoint expected:

POST /api/memory/correct

Questions:
- What fields are required?
- What is the exact request schema?
- What is the exact response schema?
- Does the response identify the updated memory?

## 5. Memories Page

The frontend currently does not have a confirmed backend endpoint for listing memories.

Questions:
- Will there be a GET endpoint for listing memories?
- If yes, what is the endpoint and response schema?
- What fields should be displayed on each memory card?

Until this is confirmed, the /memories page will use mock data.

## 6. Memory Metadata

Please confirm whether backend responses will provide:

- Product
- Product version
- Issue
- Source/type
- Memory category
- Created date
- Updated date
- Historical/current status
- Evidence or source information

## 7. Backend Availability

Please confirm:

- Backend base URL
- CORS configuration for the frontend
- API authentication requirements, if any
- Expected error response format
