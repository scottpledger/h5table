h5table
=======
[![Build Status][travis-ci-image]][travis-ci-status]

h5table is a jQuery-based replacement for tables. It supports searching,
remote data sets, and pagination of results.

To get started, checkout examples and documentation at
https://h5table.github.io/

Use cases
---------
* Enhancing native selects with search.
* Enhancing native selects with a better multi-select interface.
* Loading data from JavaScript: easily load items via AJAX and have them
  searchable.
* Nesting optgroups: native selects only support one level of nesting. h5table
  does not have this restriction.
* Tagging: ability to add new items on the fly.
* Working with large, remote datasets: ability to partially load a dataset based
  on the search term.
* Paging of large datasets: easy support for loading more pages when the results
  are scrolled to the end.
* Templating: support for custom rendering of results and selections.

Browser compatibility
---------------------
* IE 8+
* Chrome 8+
* Firefox 10+
* Safari 3+
* Opera 10.6+

Usage
-----
You can source h5table directly from a CDN like [JSDliver][jsdelivr] or
[CDNJS][cdnjs], [download it from this GitHub repo][releases], or use one of
the integrations below.

Integrations
------------
* [Wicket-h5table][wicket-h5table] (Java / [Apache Wicket][wicket])
* [h5table-rails][h5table-rails] (Ruby on Rails)
* [AngularUI][angularui-select] ([AngularJS][angularjs])
* [Django][django-h5table]
* [Symfony][symfony-h5table]
* [Symfony2][symfony2-h5table]
* [Bootstrap 2][bootstrap2-h5table] and [Bootstrap 3][bootstrap3-h5table]
  (CSS skins)
* [Meteor][meteor-h5table] ([Bootstrap 3 skin][meteor-h5table-bootstrap3])
* [Meteor][meteor-h5table-alt]
* [Yii 2.x][yii2-h5table]
* [Yii 1.x][yii-h5table]
* [AtmosphereJS][atmospherejs-h5table]

Internationalization (i18n)
---------------------------
h5table supports multiple languages by simply including the right language JS
file (`dist/js/i18n/it.js`, `dist/js/i18n/nl.js`, etc.) after
`dist/js/h5table.js`.

Missing a language? Just copy `src/js/h5table/i18n/en.js`, translate it, and
make a pull request back to h5table here on GitHub.

Documentation
-------------
The documentation for h5table is available
[through GitHub Pages][documentation] and is located within this repository
in the [`docs` folder][documentation-folder].

Community
---------
You can find out about the different ways to get in touch with the h5table
community at the [h5table community page][community].

Copyright and license
---------------------
The license is available within the repository in the [LICENSE][license] file.

[angularjs]: https://angularjs.org/
[angularui-select]: http://angular-ui.github.io/#ui-select
[atmospherejs-h5table]: https://atmospherejs.com/package/jquery-h5table
[bootstrap2-h5table]: https://github.com/t0m/h5table-bootstrap-css
[bootstrap3-h5table]: https://github.com/t0m/h5table-bootstrap-css/tree/bootstrap3
[cdnjs]: http://www.cdnjs.com/libraries/h5table
[community]: https://h5table.github.io/community.html
[django-h5table]: https://github.com/applegrew/django-h5table
[documentation]: https://h5table.github.io/
[documentation-folder]: https://github.com/h5table/h5table/tree/master/docs
[freenode]: https://freenode.net/
[jsdelivr]: http://www.jsdelivr.com/#!h5table
[license]: LICENSE.md
[meteor-h5table]: https://github.com/nate-strauser/meteor-h5table
[meteor-h5table-alt]: https://jquery-h5table.meteor.com
[meteor-h5table-bootstrap3]: https://github.com/zimme/meteor-h5table-bootstrap3-css/
[releases]: https://github.com/h5table/h5table/releases
[h5table-rails]: https://github.com/argerim/h5table-rails
[symfony-h5table]: https://github.com/19Gerhard85/sfh5tableWidgetsPlugin
[symfony2-h5table]: https://github.com/avocode/FormExtensions
[travis-ci-image]: https://travis-ci.org/h5table/h5table.svg?branch=master
[travis-ci-status]: https://travis-ci.org/h5table/h5table
[wicket]: http://wicket.apache.org
[wicket-h5table]: https://github.com/ivaynberg/wicket-h5table
[yii-h5table]: https://github.com/tonybolzan/yii-h5table
[yii2-h5table]: http://demos.krajee.com/widgets#h5table
