# Introduction:

This project is an updated version of the project code from the "Electron with React - Building a desktop applications with React and Electron" tutorial by Coding with Justin. 
* YouTube: https://www.youtube.com/watch?v=oAaS9ix8pes
* Original GitHub repository: https://github.com/codingwithjustin/react-electron

This project was made using Node 18.12.1 LTS, React 18.2.0, Electron 21.3.1 and Bootstrap 5.2.3 which are (as of writing) the latest LTS/non-preview versions.

There are several changes done in order to support these newer versions and to fix now depreciated/removed features from the original project code. These include:
* In `package.json`, the `"wait-on tcp:3000"` and `"electron ."` commands are now done concurrently. This is because the original script, which separated the two commands with a `"&&"`, doesn't open an Electron window.
* In `public/main.js`, since `enableRemoteModule` has been removed from Electron, it has therefore been removed from the `webPreferences` of the `BrowserWindow`.
* In `public/main.js`, Electron now requires that the `@electron/remote` must be directly enabled for the `webContents` of the `BrowserWindow`. The relevant code is: 
    ```
    require('@electron/remote/main').enable(win.webContents)
    ```
* In `src/index.js`, Electron no longer supports importing `createRoot` from `react-dom`. It has now moved to `react-dom/client`. Therefore, the import has been changed to:
    ```
    import ReactDOM from 'react-dom/client'
    ```
* In `src/index.js`, `ReactDOM.render` is no longer supported in React, and it requires `createRoot` to be used instead. Therefore, we create a variable called `root` which create a root that accesses the element with the `root` id by using `getElementById`. Instead of using `ReactDOM.render`, `root.render` is used instead. Since the container to create the root (where it has gotten said `root` element) has already been passed, the second argument passed to the `render` function (which was `document.getElementById("root")`) is not needed anymore. This section of code has been changed to:
    ```
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
        <React.StrictMode>
        <App />
        </React.StrictMode>
    )
    ```
* In `src/App.js` and `src/FilesViewer.js`, an `id` property has been added, which starts at `i = 0` (meaning the first item, in this case a child, has an `id` of 0) and is incremented by 1 for each mapping. This is done so that each child mapping in the `files` array has a unique key. A child's `id` is set as the `key` attribute of the table row it uses. The `i` variable is also stored as a dependency. The relevant code is:
    * From `App.js`
        ```
        let i = 0
        const files = useMemo(
            () =>
                fs
                .readdirSync(path)
                .map(file => {
                    const stats = fs.statSync(pathModule.join(path, file))
                    return {
                        id: i++,
                        name: file,
                        size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
                        directory: stats.isDirectory()
                    }
                })
                ...
                }),
            [path, i]
        )
        ```
    * From `FilesViewer.js`
        ```
        {files.map(({ id, name, directory, size }) => {
            return (
                <tr key={id} className="clickable" onClick={() => directory && onOpen(name)}>
                ...
                </tr>
            )
        })}
        ```
* In `src/FilesViewer.js`, the attribute inside the `<table>` tag is changed from `class` to `className`, which is a React convention. The relevant code is:
    ```
    <table className="table">
    ...
    </table>
    ```
	
## Node
If you don't Node installed, download it from the official website: https://nodejs.org/

For this tutorial:
* In "End-User License Agreement", accept the License agreement.
* In "Destination Folder", use the default install location.
* In "Custom Setup", you don't need to change anything.
* In "Tools for Native Modules", tick the checkbox saying "Automatically install the necessary tools. Note that this will also install Chocolatey. The script will pop-up in a new window after the installation completes.".
* After installing, follow the prompts that appear in a window titled "Install Additional Tools for Node.js", which will say to press any key to continue.

In a fresh command prompt (cmd) window, check to see the installation is successful by displaying the version number. To do this, enter the following into the command prompt: 
```
node -v
```

## npm vs yarn
The equivalent commands used in the tutorial for npm and yarn have been provided in the "Commands used" section. 

To install yarn, enter this command: 
```
npm install --global yarn
```

It is recommended to use yarn if possible, because it is faster (since it installs the packages in parallel instead of sequentially) and more secure (since it verifies the packages with checksum instead of using SHA-512 from `package-lock.json`).

## Commands used
* Create the project:
    ```
    npx create-react-app react-electron
    ```
* After creating the project, go into the folder and use either the yarn commands or the npm commands:
    * Commands to add packages:
        * Add core packages:
            ```
            yarn add electron concurrently wait-on cross-env
            npm i electron concurrently wait-on cross-env
            ```
		* Add electron remote:
			```
			yarn add @electron/remote
            npm i @electron/remote
			```
        * Add bootstrap:
            ```
            yarn add bootstrap@next
            npm i bootstrap @next
            ```
        * Add build and installer compilation packages:
            ```
            yarn add electron-builder electron-is-dev
            npm i electron-builder electron-is-dev
            ```
    * Commands for the project using the scripts:
        * Run the project in Electron:
            ```
            yarn electron:serve
            npm run electron:serve
            ```
        * Compile the project into a build and an installer
            ```
            yarn electron:build
            npm run electron:build
            ```
## Scripts used:
* Within `package.json`, in the `scripts` section:
    * If yarn is being used:
		```
		"scripts": {
			"start": "react-scripts start",
			"build": "react-scripts build",
			"test": "react-scripts test",
			"eject": "react-scripts eject",
			"electron:serve": "concurrently -k \"cross-env BROWSER=none yarn start\" \"yarn electron:start\"",
			"electron:build": "yarn build && electron-builder -c.extraMetadata.main=build/main.js",
			"electron:start": "concurrently -k \"wait-on tcp:3000\" \"electron .\""
		},
		```
    * If npm is being used:
		```
		  "scripts": {
			"start": "react-scripts start",
			"build": "react-scripts build",
			"test": "react-scripts test",
			"eject": "react-scripts eject",
			"electron:serve": "concurrently -k \"cross-env BROWSER=none npm start\" \"npm run electron:start\"",
			"electron:build": "npm run build && electron-builder -c.extraMetadata.main=build/main.js",
			"electron:start": "concurrently -k \"wait-on tcp:3000\" \"electron .\""
		  },
		```

## Note regarding the Electron Security Warning (Insecure Content-Security-Policy).
* A Content-Security-Policy (CSP) has not been added within the head of `public/index.html` because this project uses inline scripting.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
