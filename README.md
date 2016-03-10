# munger-builder

[www.mungerbuilder.com](http://www.mungerbuilder.com)

A tool for generating Python + Pandas scripts to do data munging (for now mostly pivot tables), using a simple, drag-and-drop GUI built in Javascript. Inspired by tools like [Looker]((http://www.looker.com)) and [Tableau]((http://www.tableau.com)).

Still a work in progress, and there may be active issues, please report any bugs in the issue tracker.

Stay tuned for updates, more functionality to come!

## FAQ

#### What does munge mean?
>"According to The New Hacker's Dictionary , munge (pronounced MUHNJ ) is (1) a verb, used in a derogatory sense, meaning to imperfectly transform information, or (2) a noun meaning a comprehensive rewrite of a routine, data structure, or the whole program."

>Source: New Hacker's Dictionary via [WhatIS.com](http://whatis.techtarget.com/definition/munge)

I like to think of munging as the art of balancing between the two definitions.

#### What does "munger builder" do?
The idea is that a person has some data that they would like to do transformations on. This tool allows anyone, regardless of coding knowledge, to generate a script to munge the data as needed. These scripts are designed to run without any extra code (hopefully), and can work on extremely large data sets using the [Pandas](http://pandas.pydata.org/ "Pandas") Data Analysis Library.

#### Why did you make this?
The main reason I made this is because of how I learned to code. I started by using the Excel VBA macro recorder to generate semi-working code to automate some basic data manipulation tasks. These very basic scripts made me much more productive with minimal coding knowledge, and could be extended as I learned. It made getting into programming much easier as I could justify spending time to improve the code and sharpen my programming skills for big payouts to my work efficiency.

#### Who is this for?
If you already know some Python, this probably isn't for you (the scripts are pretty basic). If you have never touched Excel, this probably isn't for you either. This is for people that like crunching numbers, and have a desire to learn how to code so they can work more efficiently, and do more advanced analysis.

#### What do I do with the script?
You run it! (And try to fix any errors that you may encounter with some creative googling.) If you are new to Python check out the [Anaconda](https://www.continuum.io/downloads "Anaconda") distribution, it includes everything you need to get started right out of the box. Once you have successfully run a script and have a basic feel for what each part does, consider trying to add some functionality. Maybe look into extending the pivot functionality or [web scraping](https://automatetheboringstuff.com/chapter11/ "Automate the Boring Stuff") or learn how to interact with an [API](http://www.programmableweb.com/apis/directory "ProgrammableWeb"). The only limit is your imagination!

#### What's Next?
I plan on continuing to add functionality, but I'm not quite sure what direction to take next. Goals include:

 - Real Pivot Functionality
 - Filters and Sorting on Data
 - Custom Aggregate Functions
 - Wildcard File Matching
 - Support for the [Agate](https://agate.readthedocs.org/en/1.1.0/ "Agate") Data Analysis Library (Very cool and easy, but not as big of a knowledge-base)
 - A way to run Mungers directly in browser (already doable as an admin, but security concerns...)
 - Better options for more customizability (headers, summary, column order, etc.)
 - More examples of extensibility (web scraping, more pandas stuff)


There's also some other relatively simple python tasks I'm thinking of making similar tools for, like web scraping, xml parsing, and maybe some sort of loop/conditional builder? Ideally they could all work together to make something really useful for people starting to learn Python.

If you have a feature request, or are interested in the other tools, feel free to let me know. Contributions are welcome as well (especially from any front end developers...)
