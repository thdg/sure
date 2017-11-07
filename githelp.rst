Setup
-----

Setup your name and email::

    git config --global user.name "Your Name"
    git config --global user.email "Your@Email.dat"


Adding files
------------

Adding files and changes::

    git add <path-to-file>
    git add <path-to-other-file>
    git add <path-to-file> <path-to-other-file> <path-to-third-file>

Commiting
---------

Commiting changes::

    git commit -m "Message"

Pushing
-------

Pushing to the source::

    git push origin master

or::

    git push --set-upstream origin master # Only ones
    git push


Pulling
-------

Pulling changes from the source::

    git pull

or::

    git pull --rebase

Pilling might cause merge conflicts, follow the instructions from git to resolve them.
