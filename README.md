# HRM System App

![HRM System](https://i.ibb.co/PvGKMvCk/Chat-GPT-Image-20-43-03-17-thg-9-2026.png)

## Technical Stack

**Mobile App:**

- Platform: **iOS** & **Android**
- Mobile development platform: React Native (0.81.5)
- IDE: **Visual Studio Code**, **Cursor**
- State management: **Redux**
- App Id Android: com.hrm.system.dev (dev) / com.hrm.system (prod)
- App Id iOS: com.hrm.system.dev (dev) / com.hrm.system (prod)
- API server...

## Prettier and ESLint configuration

- **Eslint:** [(here)](#) Follow [AirBnb](https://github.com/airbnb/javascript) guideline. Configure inside **.eslintrc.js** file.
- **Prettier:** [(here)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Follow some of the ESLint config. Please setting up **format on save** on Prettier on your IDE for easier code formatting.

## Source control guideline

Check out our presentation: [Git-flow](https://docs.google.com/presentation/d/1vfF1usCdk2NmQUSA82unPnUNGNf1nsOibAVp3btHSow/edit#slide=id.g4d4aa58873_0_292)

We're using Git here. Also, to utilize the branches structure for clearer and easier to understand, we've inherited the Git-flow structure. Here are the basic:

- **master**: production-ready branch.
- **dev**: develop-ready branch.
- **feat(/ or -)**: feature branches. Can be deleted after finish the feature.
- **release(/ or -)**: release branches. Usually for demo or releases (add tags or milestones if needed)
- **hotfix(/ or -)**: hotfix branches (for release branches). Usually if release branches has issues, hotfix can be used for fixing those.
- **fixes(/ or -)**: bugfix branches (for development). Named after feature branches. Closed or deleted after finished fixing issues.

### Some ground rules for adding, committing, pushing, pulling,...

- **Add only changes files**. Some forbidden files: **.lock** files, **node_modules** folder, **build** folder (inside `ios` or `android`),...

```
git add app/index.js
git add app/models/stores.js
```

- **Commit messages:**

1. Should be **clear** & **straight to the point**.
2. In **title** case.
3. No longer than **50 characters**.
4. **Recommend** using [commit message emoji](https://gist.github.com/minhnguyen0712/17885cf3d397fc3712596478a8431ef9) for clear understanding. <-- Check

Example:

```bash
git commit -m "🎉 Initial commit"
git commit -m "🐛 Fixed a bug on LoginScreen"
git commit -m "✨ Added Header component"
git commit -m "✨ Added title cards for HomeScreen"
git commit -m "- ✨ Added Footer for HomeScreen
> - 🐛 Fixed a crash error on Login
> - 🐛 Fixed layout on CardScreen"
```

- **Checkout branch:** create new branches follow the Git-flow rules. Keep the branch updated to develop. If not needed, then delete the branch.

```bash
git checkout -b feat/Login
git checkout dev
git checkout -d fixes/Login
```

- **Merge requests:** create a merge request with changed file only. Please specify if you want to delete the branch or not, assignee, labels, tags, ...

## Libraries

Beside basics, these are the essentials libraries for development:

- [reduxsauce](https://github.com/jkeam/reduxsauce)
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
-

## Installation

Some applications,packages and clis needs to be installed:

- [Homebrew](https://brew.sh/) (**Recommended**: install Homebrew first for easier installing Node and Watchman)
- **Xcode** (required for running apps on iOS)
- **Android Studio** (required for running apps on Android)
- [Cocoapods](https://cocoapods.org/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Node.js](https://nodejs.org/en/download/) (12 LTS or greater)
- [Watchman](https://facebook.github.io/watchman/docs/install.html)

Run the following commands in a Terminal after installing Homebrew:

```
brew install node
brew install watchman
```

## Usage

```bash
cd <project-root>/
yarn install
cd ios && pod install && cd ../
touch .env #create file env .env

# Final, to run the project
#iOS
npx react-native run-ios
#Android
npx react-native run-android
```

## Project folder organization

- android # Android native project
- ios # Ios native project
- src # Source code for both platform
  - assets # Contain all assets like fonts, icons, images
  - components # Precision components
  - navigations # Contains files for screen define, config router.
  - screens # Contain all our screens
  - services # Contain all services files
  - utils # Contain all Utilities
  - App.ts # Register model, router, plugins
- babelrc.js
- tslint.js
- package.json
- index.js

## Alias

- @assets: './src/assets/',
- @components: './src/components/',
- @navigation: './src/navigation/',
- @services: './src/services/',
- @utils: './src/utils/',

```bash
Using:
   import {Root} from '@containers';
   import {Indicator} from '@components';
```

## Lib extends Default

- @react-native-community/async-storage
- @react-navigation/bottom-tabs
- @react-navigation/native
- @react-navigation/stack
- axios
- lodash
- moment
- prop-types
- react-native-screens
- react-native-webview
- react-redux
- reactotron-react-native
- reactotron-redux
- redux
- redux-persist
- redux-saga

## Debug tool

- [Reactotron](https://github.com/infinitered/reactotron/)
- See config at `src/config/ReactotronConfig.js`

## Coding convention

- React component: https://github.com/airbnb/javascript/tree/master/react

## Contributing rules

- Please do not make changes in **master** and **develop** branches.

## License

[No license](#)
