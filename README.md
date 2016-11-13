# Dual N-Back Training

Dual N-Back training is an application that may, with daily training, improve a person's intelligence.

This application is a replica of the Dual N-Back application that was used in Jaeggi, S., Buschkuehl, M., Jonides, J. and Perrig, W. (2008). Improving fluid intelligence with training on working 
memory. *Proceedings of the National Academy of Sciences of the United States of America*, 105(19), pp. 6829-6833. Further information available 
[on the original site](http://www.soakyourhead.com/Research.aspx), and [in the research paper](http://www.pnas.org/content/105/19/6829.abstract).

The application is a JavaScript conversion of the [original Silverlight version](http://www.soakyourhead.com/dual-n-back.aspx). As support for Silverlight diminishes in 
most modern browsers, this conversion will hopefully help users continue to use Dual N-Back training.
                    
## How to Play

When you press the Start button, the application will begin by showing you a box and playing an audio recording of a letter. Remember where the box appeared and also remember the letter. After a 
few seconds, another box appears and another letter is played. Remember these, too. When you start the game, it will start at the 2-back level (displayed across the top). This means that you 
need to remember if a letter was repeated or a box appeared in the same location 2 times ago. For example:

1.  Top-right corner, letter 'F'.
2.  Bottom-right corner, letter 'G'.
3.  Top-right corner, letter 'S'.
4.  Bottom-middle, letter 'G'.

For the first 2 'blocks' you don't need to do anything because you are at the 2-back level (this obviously increases as you go up the levels). But when the third block is presented 
you need to decide if it matches the position or the letter (or both) of block 1. Likewise, for block 4, does it match either the position, letter, or both, of block 2, etc. etc. Press 
the letter 'a' on the keyboard if the position matches, 'l' if the letter matches, or both if they both match.

So, from the example above, when block 3 is presented, the position matches block 1 (top-right corner), but the letters do not. So, press 'a'. For block 4, the position doesn't match 
block 2, but the letter does, so press 'l'. Remember blocks 3 and 4 to carry on. Each session has 20 blocks. At the end of the session, if you have performed well, the level will increase 
to 3. So, you need to remember whenever the letter/square matches what was said/displayed 3 times ago. The level can increase or decrease depending on your performance. An entire training 
run consists of 20 sessions. Finish the entire run to see your results, which you can optionally save by toggling the save progress switch.

Be aware that this is a difficult game. At first, it will be difficult to press the correct keys. Be assured that this was the same for the research subjects when they first started. 
However, after enough practice, the subjects improved.

For more information see the [demo on the original site](http://www.soakyourhead.com/dual-n-back.aspx). Note this requires Silverlight. I will be porting the demo to a native web application in due course.

## Bugs and Issues

Have a bug or an issue? [Open a new issue](https://github.com/Poc275/NBack/issues) here on GitHub.

## References

The original source code is available [here](http://www.soakyourhead.com/dual-n-back-open-source.aspx).

Uses Start Bootstrap which was created by and maintained by **[David Miller](http://davidmiller.io/)**, Owner of [Blackrock Digital](http://blackrockdigital.io/).

* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

Uses [Bootstrap Toggle](http://www.bootstraptoggle.com/) for the toggle switch.

[QUnit](https://qunitjs.com/) used for the tests.