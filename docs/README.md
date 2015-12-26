h5table Documentation
=====================
[This repository][h5table-docs-source] holds the latest documentation for
[h5table][h5table].

What is this?
-------------
The documentation is automatically extracted from the `docs` directory at the
[h5table source repository][h5table-source]. This is done periodically by
the maintainers of h5table.

How can I fix an issue in these docs?
-------------------------------------
If you are reading this from the source repository, within the `docs` directory,
then you're already in the right place. You can fork the source repository,
commit your changes, and then make a pull request and it will be reviewed.

**If you are reading this from the
[documentation repository][h5table-docs-source], you are in the wrong place.**
Pull requests made directly to the documentation repository will be ignored and
eventually closed, so don't do that.

How can I build these docs manually?
------------------------------------
In the [main h5table repository][h5table-source], you can build the
documentation by executing

```bash
grunt docs
```

Which will start up the documentation on port 4000. You will need
[Jekyll][jekyll] installed to build the documentation.

[jekyll]: http://jekyllrb.com/
[h5table]: https://h5table.github.io
[h5table-docs-source]: https://github.com/h5table/h5table.github.io
[h5table-source]: https://github.com/h5table/h5table
