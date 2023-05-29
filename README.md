# Text-it
Send arbitrary sms messages to and from numbers.  

# Disclaimer
For educational purposes only. Do not use with malicious intent.  
Author disclaims liability for unauthorized or unethical use.  
Use responsibly!  

### Change log:

#### 2023-05-29
The main differene is that I removed the form post-back as it felt a bit '98...
I've replaced the form post with an ajax call (not the latest and greatest... but it works). I also needed to add jquery for this

I've also added knockout.js as I thought it'd interesting to see how you work with SPA's

* Added bootstrap for better/standard looking UI
* Added knockout.js for SPA support
* Added js/site.js to create the view model

I left the MVC code (nunjucks), although I'd recommend using knockout.js instead 