# valorant-skin-manager
[![Discord](https://img.shields.io/badge/discord-join-7389D8?style=flat&logo=discord)](https://discord.gg/uGuswsZwAT)
<span class="badge-buymeacoffee">
<a href="https://ko-fi.com/colinh" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>
</span>

(wip) better inventory manager for valorant

# Running VSM Development Versions for beta testing, debugging or contributing
> 🚨 The latest version pushed to GitHub might be extremely unstable - in some cases unusable. Proceed at your own risk! I will not help you run a development version, just wait for a release.

## Prerequisites
- [**Python == 3.9**](https://www.python.org/downloads/)
- [**Node.js and npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Installation

### 1. Clone GitHub Repository
[Download](https://github.com/colinhartigan/valorant-skin-manager/archive/refs/heads/master.zip) or clone the repo:
```
git clone https://github.com/colinhartigan/valorant-skin-manager.git
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

### 5. Start websocket server and electron app
These commands have been automated in `run_dev.bat`
```cmd
cd server
python main.py

cd app
npm start
```
Alternatively, you can start only the websocket server and open https://colinhartigan.github.io/valorant-skin-manager/ in your browser
```cmd
cd server
python main.py
```

# Contributing
If you have improvements or ideas to improve the design or code of the app, please open a pull request with your changes!
