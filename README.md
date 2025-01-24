### TeleSapp - Whatsapp like feel with Telegram like *Privacy*

This is a fully **End-to-End-Encrypted** app real-time chat application that supports user authentication, guest login, and room-based chatting. The application is designed for anonymous and temporary interactions, leveraging modern technologies for real-time updates and scalability.

---

## Features

- **Real-Time Communication**: Powered by Socket.IO for instant messaging.
- **Authentication**: JWT-based authentication for registered users.
- **Guest Login**: Join the chat without signing up as a guest.
- **Typing Indicators**: Visual feedback for when users are typing.
- **Read Recipis**: Read recipits to check if the message is read.
- **Active User Tracking**: Display active users in a room.
- **Message History**:
  - **Redis**: Temporarily stores messages for quick access (1-hour expiry).
  - **PostgreSQL**: Stores messages for persistent storage (1-day retention).
- **Responsive UI**: Built with React to provide a clean and dynamic user experience.
- **Security Features**:
  - Rate limiting to prevent abuse.
  - Helmet.js for enhanced security.
  - Validations for all user inputs.

---

## Tech Stack

### Backend
- **Node.js** with **Express.js**: RESTful API and WebSocket server.
- **Socket.IO**: Real-time communication.
- **Redis**: Caching for real-time message retrieval.
- **PostgreSQL**: Persistent storage for chat messages and user data.
- **JWT**: Authentication and session management.
- **Rate-Limiter**: Limits requests to prevent abuse.
- **Helmet.js**: Security enhancements.

### Frontend
- **React**: User interface with dynamic components.
- **CSS**: Custom styling for a responsive and clean design.

---

### Progress still on going will be launched on tor for more privacy and normal version for normal users
#### TODO
- Voice and Video Call
- Message Encrption
- UI Updates for mobile
- User settings page
- QR scanner for faster login

#### Suggest some more feaures below
