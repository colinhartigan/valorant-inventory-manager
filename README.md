# valorant-skin-manager
[![Discord](https://img.shields.io/badge/discord-join-7389D8?style=flat&logo=discord)](https://discord.gg/uGuswsZwAT)

(wip) better inventory manager for valorant

# Runing VSM Development Versions
> 🚨 The latest version pushed to GitHub might be extremely unstable - in some cases unusable. Proceed at your own risk!

## Prerequisites
- [**Python >= 3.9**](https://www.python.org/downloads/)
- [**Node.js and npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Installation

### 1. Clone GitHub Repository
[Download](https://github.com/colinhartigan/valorant-skin-manager/archive/refs/heads/master.zip) or clone the repo:
```
git clone https://colinhartigan/valorant-skin-manager.git
```

### 2. Install Node modules
```cmd
cd client
npm install 
```

### 3. Install Python packages
```cmd
cd server
python -m pip install -r requirements.txt
```

### 4. Add user credentials
In the root folder `/valorant-skin-manager`, create a `.env` file:
```env
VALORANT_USERNAME=your_username
VALORANT_PASSWORD=your_password
REGION=your_region
```
Valid regions are: `na, eu, latam, br, ap, kr, pbe`

### 5. Start React development server
```cmd
cd client
npm start
```
The react webserver runs on **port 3000** by default @ `localhost:3000`

### 6. (in separate terminal) Start Python websocket server
```cmd
cd server
python ./main.py
```

`/app` is currently unused - it will eventually be the Electron container

# Contributing
If you have improvements or ideas to improve the design or code of the app, please open a pull request with your changes!
