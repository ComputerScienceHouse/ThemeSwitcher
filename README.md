# CSH ThemeSwitcher
A service that allows the user to preview and select a bootstrap theme which can then be pulled to other services via an api to allow a continuous, user customised experience across various CSH services.

Themeswitcher uses node and express to serve the static site and preform api routing, OIDC for authentication, AngularJS for a responsive frontend, and bootstrap for styling.

## API
**https://themeswitcher.csh.rit.edu/api/get**
Redirects to the currently logged in member's theme.

Implement as:
```html
<link rel="stylesheet" href="https://themeswitcher.csh.rit.edu/api/get" media="screen">
```

## Contributing
### Pull Requests
To contribute to themeswitcher, please fork this repository and submit a pull request. If it is a significant change (more than a couple lines) please create a new branch.
### Issues
As themeswitcher is hosted on GitHub, it uses GitHub's issue tracker to document issues. Please open any issues there.
### Adding Themes
If you want to add a theme, edit /data/themes.json.
The name field will be displayed in the dropdown, and the cdn field is the name of the theme on s3. At present, themeswitcher only accepts themes that are hosted on s3.csh and that use bootstrap v4.0.0
