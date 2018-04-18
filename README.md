# CSH ThemeSwitcher
A service that allows the user to preview and select a bootstrap theme which can then be pulled to other services via an api to allow a continuous, user customised experience across various CSH services.

Themeswitcher uses node and express to serve the static site and preform api routing, OIDC for authentication, AngularJS for a responsive frontend, and bootstrap for styling.

## API
`https://themeswitcher.csh.rit.edu/api/get`
Redirects to the currently logged in member's theme.

`https://themeswitcher.csh.rit.edu/api/colour`
Returns the theme's primary colour, e.g. `#ffffff`

Implement as:
```html
<link rel="stylesheet" href="https://themeswitcher.csh.rit.edu/api/get" media="screen">
```

## Contributing
### Pull Requests
To contribute to themeswitcher, please fork this repository and submit a pull request. If it is a significant change (more than a couple lines) please create a new branch. Excluding ReadMe changes, pull requests to site will not be accepted.
### Issues
As themeswitcher is hosted on GitHub, it uses GitHub's issue tracker to document issues. Please open any issues there.
### Adding Themes
Themes are stored in `/pub/data/themes.json` in the style of
```json
  {
    "name": "Material",
    "shortName": "csh-material-bootstrap",
    "cdn": "https://s3.csh.rit.edu/csh-material-bootstrap/4.0.0/dist/csh-material-bootstrap.min.css",
    "colour": "b0197e"
  },
```
If you'd like to add a theme, add it to `themes.json` in the same pattern, detailed below.
* `name`: The string to display in the selector. This is how your theme is identified to users.
* `shortName`: A string to identify your theme to the api. Cannot include spaces.
* `cdn`: The url to the minified stylesheet.
* `colour`: The primary colour of the theme.

All themes should be bootstrap 4.0.0.
