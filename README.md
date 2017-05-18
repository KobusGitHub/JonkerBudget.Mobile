Install latest version of Node
https://nodejs.org/en/

npm install angular2 -g
npm install typings -g

 npm install -g ionic cordova




After you copied the project to new git location

1) Open console at project route.
2) run "Ionic platform add android"
3) run "Ionic platform add ios"
4) Open config.xml in route
    Replace:
        from <widget id="com.ionicframework.ionicmobiletemplate652203" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
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
