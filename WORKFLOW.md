# Git Feature Branch Workflow
This .md was created in order to set a flow when commiting codes. As the team is growing everyday I found it useful to everyone that we had some steps to follow and don't let the code break into a thousand of conflicts that could fade away some parts of code and something else. It is also a complementing to [CONTRIBUTING.md](CONTRIBUTING.md)

So here we have the suggested steps, but feel free to suggest somthing different you didn't agree or thing we could improve.

##When developing a new feature

When a new feature starts to be implemented, you should create a new branch with your name (optional) followed by the feature name you think should be good. But before that, you should keep your ```master``` up-to-date.

So, go to your ```master```branch and synchronize with the remote repository as follow:

```sh
$ git pull origin
```

After that, you create your brand new branch with your custom name:

```sh
$ git branch -b [myName-]the-new-awesome-feature
```

So you have your new branch synchronized with the ```master```, as you created it from the master branch.

####adding new commits to your branch

Now you have your new branch ```[myName-]the-new-awesome-feature``` and want to add new commits to it. You proceed normally, adding your new commits to your local branch without any concern. But beyond add new commits, you get the point when you have to push them to remote, also creating the new branch on github if it still does not exist. And here are the steps proposed.

Before send this new commits AND your branch to the remote, you should keep it synchronized with your ```master```again, because some other devs could be added something to the ```master```. So what you do here is, firstly, add your commits to your branch with: (in parenthesis your current branch)

```sh
$ (myName-the-new-awesome-feature) git add <files you want>
$ (myName-the-new-awesome-feature) git commit -m "your message"
```

After that, your ```git status```is ok and you have nothing else to add or commit according to your judgment :P

Then it's time to synchronize with ```master```. But how do we do that? Here we go

####update master

Firstly, we have to go from our branch to the ```master```. We do it this way:

```sh
$ git checkout master
```

Now, if git let you go to the master, we can pull everything from remote master and get everything that is already there.

```sh
$(master) git pull --rebase
```

So our ```master``` is now up-to-date. Then it's time to go back to our branch and merge it with ```master```. But we will do it using git [rebase], not traditional merge:

```sh
$ git checkout myName-the-new-awesome-feature
$ (myName-the-new-awesome-feature) git rebase master
```

At this point, you could have conflicts when git is merging the code. Resolve then adding what you fix and continue with ```git rebase --continue```. 
When git finishes the rebase you now ready to push your branch to github:

```sh
$ (myName-the-new-awesome-feature) git push origin myName-the-new-awesome-feature
```

And that's it! Everything is now on github and your branch is separeted from master. But... why we did all this stuffs? So here we have our next step...

###Pull requests

Now your branch ```myName-the-new-awesome-feature```is on github and we need to merge it with ```master```. Insted of just going into your master and merging or add code from someone's branch, we first open a [pull request] on github. 

This way everyone on the project can look at your feature and what new you have for us. A code review can be a good way to "Improve the design of existing code". After everyone agree that the feature is ok  (mainly the QA's =P) we can now just click on the merge button at the end of the page.

####in a nutsheel

* update your ```master```
* create your new feature-branch
* add your modification and commit
* go to ```master```and update it
* rebase your branch with ```master```
* resolve possible conflicts
* push your branch to remote
* open a pull request
* merge with master after everthing's ok!


###Final notes

This is just a sugestion and feel free to discuss new ideas or even reject everything of this workflow.
For more information, read the following links:

* [pull request] - Using pull requests
* [git branches] - Git Branching
* [Branch rebasing]
* [rebase] - Git rebase command
* [Feature Branch] - Feature branch workflow

[pull request]:https://help.github.com/articles/using-pull-requests/
[Branch rebasing]:http://git-scm.com/book/en/v2/Git-Branching-Rebasing
[rebase]:http://git-scm.com/docs/git-rebase
[git branches]:http://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
[Feature Branch]:https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
[CONTRIBUTING.md](CONTRIBUTING.md)
