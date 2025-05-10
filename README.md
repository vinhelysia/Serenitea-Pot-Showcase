# Serenitea Pot Showcase

![Serenitea Pot Banner](https://i.imgur.com/XYZ123.png)

## Overview

Serenitea Pot Showcase is a community platform for Genshin Impact players to share, discover, and vote on creative Serenitea Pot designs. This repository contains the source code for the web application that allows players to upload screenshots, provide layout information, and interact with other creators' designs.

## Features

- **Design Gallery**: Browse through community-submitted Serenitea Pot designs with search and filter options
- **User Profiles**: Create personal profiles to showcase your designs and track favorites
- **Layout Details**: Share furniture lists, layout tricks, and building techniques
- **Voting System**: Like and bookmark your favorite designs
- **Comments**: Engage with other players and provide feedback on designs
- **Responsive Design**: Enjoy a seamless experience on desktop and mobile devices

## Technologies

- Frontend: React, Redux, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Firebase Auth
- Image Storage: Firebase Storage
- Deployment: Vercel

## Installation

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Firebase account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/vinhelysia/Serenitea-Pot-Showcase.git
cd Serenitea-Pot-Showcase
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## Community Guidelines

When submitting designs or interacting with the community, please:

- Be respectful of other creators
- Only submit your own original designs
- Provide credit for inspiration if applicable
- Follow Genshin Impact's terms of service

## Roadmap

- [ ] Design rating system with different categories
- [ ] AR-specific design challenges
- [ ] Integration with HoYoLAB API (if available)
- [ ] Video tour uploads
- [ ] Blueprint sharing system

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The Genshin Impact community for continuous inspiration
- HoYoverse for creating the wonderful world of Teyvat
- All contributors who have helped this project grow

---

*Note: This is a fan-made project and is not affiliated with HoYoverse or Genshin Impact officially.*
