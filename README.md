This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start mySideMenu sidemenu
```

Then, to run it, cd into `mySideMenu` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.


DEV NOTES:

Install latest version of Node
https://nodejs.org/en/

npm install angular4 -g
npm install typings -g

 npm install -g ionic cordova




After you copied the project to new git location

1) Open console at project route.
2) run "Ionic platform add android"
3) run "Ionic platform add ios"
4) Open config.xml in route
    Replace:
        from <widget id="io.ionic.starter" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
        to <widget id="io.ionic.starter.YOUR_APP_NAME_HERE652203" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
        to <widget id="com.ionicframework.YOUR_APP_NAME_HERE652203" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
        and
        from <name>IonicMobileTemplate</name>
        to <name>YOUR_APP_NAME_HERE</name>


-Run in browser:
ionic serve

-Run in Android
ionic run android

-Run in IOS
ionic run ios



if you ever get an error like:
"Has no exported Member 'IonicNativePlugin'" 

npm uninstall --save @ionic-native/core
npm install --save @ionic-native/core@latest


Restore Missing Plugins in ionic mobile app
 ionic state restore




INCASE you get some Google repository license issue do this:

make sure this path exist:
C:\Users\{user}\AppData\Local\Android\sdk\tools\bin

use same path in cmd
run: sdkmanager --licenses

